import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService, Definition, I18nService, Language, Product, Translation } from '@kizeo/i18n/data-access';
import { SelectLanguageCodes, SelectLanguageOption } from '@kizeo/ui';
import { DataStore } from 'aws-amplify';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ZenObservable } from 'zen-observable-ts';
import { ImportTranslationsModalComponent } from './import-translations-modal/import-translations-modal.component';

interface TranslationItem {
  id: string;
  slug: string;
  language: Language;
  translation: Translation;
  definition: Definition;
  value: string  | null;
  isValid: boolean;
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

  languages: Language[] = []

  selectedLanguages: SelectLanguageOption[] = []

  languageCodesToExclude: string[] = []

  modifiedTranslationItems: Map<string, TranslationItem> = new Map()

  isSaving = false

  dtStoreSubscription?: ZenObservable.Subscription

  canValidate = false

  constructor(
    private readonly route: ActivatedRoute,
    private readonly i18nSvc: I18nService,
    private readonly imageSvc: NzImageService,
    private readonly modal: NzModalService,
    private readonly currentUser: CurrentUserService,
  ) { }

  async ngOnInit() {
    this.product = this.route.parent?.parent?.snapshot.data['product']

    this.languages = await this.i18nSvc.getLanguagesByProductId(this.product.id)

    const languageCodesForProduct = this.languages.map(l => l.code)
    this.languageCodesToExclude = Object.values(SelectLanguageCodes).filter(c => !languageCodesForProduct.includes(c))
    this.fetch()

    this.canValidate = await this.currentUser.canAccessValidateTranslationsForProduct(this.product)
  }

  async fetch() {
    this.translations = (await this.i18nSvc.getTranslationsByProductId(this.product.id))
      .filter(t => (
          (this.selectedLanguages.length > 0 ? this.selectedLanguages.map(l => l.code).includes(t.language!.code) : true)
        )
      )
      .map(t => {
        return {
          id: t.id,
          slug: t.definition!.slug,
          value: t.value || "",
          language: t.language!,
          translation: t,
          isValid: t.isValid ?? false,
          definition: t.definition!,
          defaultValue: t.definition!.defaultValue,
          isRequireTranslatorAction: t.isRequireTranslatorAction
        }
      })
      .sort((a, b) => a.isRequireTranslatorAction ? -1 : 1)
  }

  onImportTranslationClicked(language: Language) {
    this.modal.create({
      nzContent: ImportTranslationsModalComponent,
      nzWidth: 1280,
      nzComponentParams: {
        productId: this.product.id,
        languageId: language.id,
      },
      nzOnOk: () => this.fetch()
    })
  }

  onDownloadTranslationClicked(language: Language) {
    alert('FIXME: not yet implemented')
  }

  onTranslationImageClicked(translation: TranslationItem) {
    if (!translation.definition.pictureUrl) return
    this.imageSvc.preview([
      { src: translation.definition.pictureUrl, alt: translation.defaultValue }
    ])
  }

  async onFilterTranslationChanged() {
    this.fetch()
  }

  onTranslationChanged(translation: TranslationItem) {
    this.modifiedTranslationItems.set(translation.id, translation)
  }

  async toggleValidation(translation: TranslationItem) {
    const value = !translation.isValid
    translation.isValid = value
    await this.i18nSvc.setIsValidForTranslation(translation.translation.id, value)
  }

  async onSaveTranslationsClicked() {
    this.isSaving = true

    await this.i18nSvc.updateTranslations(
      Array.from(this.modifiedTranslationItems.values())
    )

    setTimeout(() => {
      this.modifiedTranslationItems.clear()
      this.fetch()
      this.isSaving = false
    }, 500)
  }
}