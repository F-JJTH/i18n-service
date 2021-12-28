import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Language, Product, Translation } from '@kizeo/i18n/data-access';
import { SelectLanguageCodes, SelectLanguageOption } from '@kizeo/ui';
import { DataStore } from 'aws-amplify';

@Component({
  selector: 'kizeo-i18n-product-detail-translations',
  templateUrl: './product-detail-translations.component.html'
})
export class ProductDetailTranslationsComponent implements OnInit {

  product!: Product;

  translations: {id: string, slug: string, language: Language, value: string, defaultValue: string}[] = []

  selectedLanguages: SelectLanguageOption[] = []

  languageCodes: string[] = []

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.product = this.route.parent?.parent?.snapshot.data['product']
    const languageCodesForProduct = (await DataStore.query(Language))
      .filter(l =>  l.product.id === this.product.id)
      .map(l => l.code)
    this.languageCodes = Object.values(SelectLanguageCodes).filter(c => !languageCodesForProduct.includes(c))
    this.fetch()
  }

  async fetch() {
    this.translations = (await DataStore.query(Translation))
      .filter((t: any) => (
          t.definition.productDefinitionsId === this.product.id &&
          this.selectedLanguages.length > 0 ? this.selectedLanguages.map(l => l.code).includes(t.language.code) : true
        )
      )
      .map(t => ({
          id: t.id,
          slug: t.definition.slug,
          value: t.value || "",
          language: t.language,
          defaultValue: t.definition.defaultValue,
        })
      )
  }

  async onFilterTranslationChanged() {
    this.fetch()
  }
}