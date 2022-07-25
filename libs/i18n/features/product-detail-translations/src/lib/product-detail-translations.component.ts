import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CurrentProductService, CurrentUserService, Definition, I18nService, Language, Product, Translation } from '@kizeo/i18n/data-access';
import { SelectLanguageCodes, SelectLanguageOption } from '@kizeo/ui';
import { TranslateService } from '@ngx-translate/core';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
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
  formControl: FormControl;
}

@Component({
  selector: 'kizeo-i18n-product-detail-translations',
  templateUrl: './product-detail-translations.component.html',
  styleUrls: ['./product-detail-translations.component.scss'],
})
export class ProductDetailTranslationsComponent implements OnInit {

  product!: Product;

  translations: Translation[] = []

  languages: Language[] = []

  selectedLanguages: SelectLanguageOption[] = []

  languageCodesToExclude: string[] = []

  modifiedTranslationItems: Map<string, TranslationItem> = new Map()

  isSaving = false

  canValidate = false

  searchDefaultValue = ''

  searchTranslation = ''

  filteredResults: TranslationItem[] = []

  filteredResultsRequireTranslatorAction = 0

  isLoading = false

  availableTranslations: string[] = []

  currentUserIsAdmin = false

  showOnlyUnvalidatedTranslations = false

  constructor(
    private readonly route: ActivatedRoute,
    private readonly i18nSvc: I18nService,
    private readonly imageSvc: NzImageService,
    private readonly modal: NzModalService,
    private readonly currentUser: CurrentUserService,
    private readonly currentProduct: CurrentProductService,
    private readonly translate: TranslateService,
    private readonly message: NzMessageService,
  ) { }

  async ngOnInit() {
    this.product = this.route.parent?.parent?.snapshot.data['product']

    this.languages = await this.i18nSvc.getLanguagesByProductId(this.product.id)

    const languageCodesForProduct = this.languages.map(l => l.code)
    this.languageCodesToExclude = Object.values(SelectLanguageCodes).filter(c => !languageCodesForProduct.includes(c))

    this.currentUserIsAdmin = await this.currentUser.isAdmin()

    if (!this.currentUserIsAdmin) {
      this.availableTranslations = await this.i18nSvc.listAvailableTranslationsForProduct(this.product.id)

      if (this.availableTranslations.length === 0) {
        this.languageCodesToExclude = Object.values(SelectLanguageCodes)
      } else if (!this.availableTranslations.includes('ALL')) {
        this.languageCodesToExclude = Object.values(SelectLanguageCodes).filter(c => !this.availableTranslations.includes(c))
      }
    }

    this.fetch()

    this.canValidate = await this.currentUser.canAccessValidateTranslationsForProduct(this.product)
  }

  async fetch() {
    this.isLoading = true
    this.translations = await this.i18nSvc.getTranslationsByProductId(this.product.id)
    this.setFilteredResult()
    this.isLoading = false
  }

  translationValidator(definition: Definition): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regexp = /({{.+?}}|%{.+?}|:\S[\w.]+)/gm;
      const result = [...definition.defaultValue.matchAll(regexp)]
      if (
        result[0] !== undefined &&
        control.value.length > 0 &&
        result.some(match => !control.value.includes(match[0]))
      ) {
        return {
          error: true,
          missingVariable: true,
          missingVariableDetail: result.map(match => match[0]).filter(match => !control.value.includes(match)).join(', ') }
      }
      return null
    }
  }

  setFilteredResult() {
    this.filteredResults = this.translations
      .filter(t => {
        if (!this.currentUserIsAdmin) {
          if (this.availableTranslations.length === 0) {
            return false
          } else if (!this.availableTranslations.includes('ALL')) {
            return this.availableTranslations.includes(t.language!.code)
          }
        }
        return true
      })
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
          isRequireTranslatorAction: t.isRequireTranslatorAction,
          formControl: new FormControl(t.value || "", [this.translationValidator(t.definition!)]),
        }
      })
      .filter(t => t.defaultValue.toLowerCase().includes(this.searchDefaultValue.toLowerCase()))
      .filter(t => t.value.toLowerCase().includes(this.searchTranslation.toLowerCase()))
      .filter(t => this.showOnlyUnvalidatedTranslations ? !t.isValid : true)

      this.filteredResultsRequireTranslatorAction = this.filteredResults.filter(r => r.isRequireTranslatorAction).length
  }

  onImportTranslationClicked(language: Language) {
    this.modal.create({
      nzContent: ImportTranslationsModalComponent,
      nzWidth: 1280,
      nzComponentParams: {
        productId: this.product.id,
        languageId: language.id,
        languageCode: language.code,
        languageName: language.name,
      },
      nzOnOk: () => {
        this.fetch()
        this.currentProduct.refresh(this.product.id)
      }
    })
  }

  onDownloadTranslationClicked(language: Language) {
    this.i18nSvc.downloadTranslationFileForProduct(this.product.id, 'dev', language.code)
  }

  onTranslationImageClicked(translation: TranslationItem) {
    if (!translation.definition.pictureUrl) return
    this.imageSvc.preview([
      { src: translation.definition.pictureUrl, alt: translation.defaultValue }
    ])
  }

  async onFilterTranslationChanged() {
    this.setFilteredResult()
  }

  onTranslationChanged(translation: TranslationItem) {
    this.modifiedTranslationItems.set(translation.id, translation)
    translation.formControl.setValue(translation.value)
    translation.formControl.updateValueAndValidity()
  }

  async toggleValidation(translation: TranslationItem) {
    const value = !translation.isValid
    translation.isValid = value
    await this.i18nSvc.setIsValidForTranslation(translation.translation.id, value)
  }

  async onSaveTranslationsClicked() {
    this.isSaving = true

    try {
      await this.i18nSvc.updateTranslations(
        Array.from(this.modifiedTranslationItems.values())
      )
      this.message.success(this.translate.instant('MESSAGE_TRANSLATION_SUCCESS_SAVED'))
    } catch(err) {
      this.message.error(this.translate.instant('MESSAGE_TRANSLATION_ERROR_SAVED'))
      throw err
    }

    this.modifiedTranslationItems.clear()
    this.fetch()
    this.isSaving = false
    this.currentProduct.refresh(this.product.id)
  }
}