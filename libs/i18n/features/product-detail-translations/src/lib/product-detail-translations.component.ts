import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Language, Product, Translation } from '@kizeo/i18n/data-access';
import { SelectLanguageCodes, SelectLanguageOption } from '@kizeo/ui';
import { DataStore } from 'aws-amplify';
import { ZenObservable } from 'zen-observable-ts';

interface TranslationItem {
  id: string;
  slug: string;
  language: Language;
  translation: Translation;
  value: string;
  defaultValue: string;
  isRequireTranslatorAction: boolean | undefined;
}

@Component({
  selector: 'kizeo-i18n-product-detail-translations',
  templateUrl: './product-detail-translations.component.html',
  styleUrls: ['./product-detail-translations.component.scss'],
})
export class ProductDetailTranslationsComponent implements OnInit {

  product!: Product;

  translations: TranslationItem[] = []

  selectedLanguages: SelectLanguageOption[] = []

  languageCodesToExclude: string[] = []

  modifiedTranslationItems: Map<string, TranslationItem> = new Map()

  isSaving = false

  dtStoreSubscription?: ZenObservable.Subscription

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.product = this.route.parent?.parent?.snapshot.data['product']
    const languageCodesForProduct = (await DataStore.query(Language))
      .filter(l => l.product.id === this.product.id)
      .map(l => l.code)
    this.languageCodesToExclude = Object.values(SelectLanguageCodes).filter(c => !languageCodesForProduct.includes(c))
    this.fetch()
  }

  async fetch() {
    this.translations = (await DataStore.query(Translation))
      .filter(t => (
          (t.definition as any).productDefinitionsId === this.product.id &&
          (this.selectedLanguages.length > 0 ? this.selectedLanguages.map(l => l.code).includes(t.language.code) : true)
        )
      )
      .map(t => {
        return {
          id: t.id,
          slug: t.definition.slug,
          value: t.value || "",
          language: t.language,
          translation: t,
          defaultValue: t.definition.defaultValue,
          isRequireTranslatorAction: t.isRequireTranslatorAction
        }
      })
      .sort((a, b) => a.isRequireTranslatorAction ? -1 : 1)
  }

  async onFilterTranslationChanged() {
    this.fetch()
  }

  onTranslationChanged(translation: TranslationItem) {
    this.modifiedTranslationItems.set(translation.id, translation)
  }

  async onSaveClicked() {
    this.isSaving = true

    let promises: Promise<any>[] = []
    const modifierLanguages: Map<string, Language> = new Map()
    this.modifiedTranslationItems.forEach(translationItem => {
      modifierLanguages.set(translationItem.language.id, translationItem.language)

      promises.push(
        DataStore.save(
          Translation.copyOf(translationItem.translation!, updated => {
            updated.value = translationItem.value
            updated.isRequireTranslatorAction = translationItem.value ? false : true
          })
        )
      )
    })

    await Promise.all(promises)

    modifierLanguages.forEach(async language => {
      const translationsRequiringTranslatorAction = (await DataStore.query(Translation))
        .filter(t => t.language.id === language.id && t.isRequireTranslatorAction === true)
      DataStore.save(
        Language.copyOf(language, updated => {
          updated.isRequireTranslatorAction = translationsRequiringTranslatorAction.length > 0 ? true : false
        })
      )
    })

    setTimeout(() => {
      this.modifiedTranslationItems.clear()
      this.fetch()
      this.isSaving = false
    }, 500)
  }
}