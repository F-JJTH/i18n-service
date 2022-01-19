import { Component, Input, OnInit } from '@angular/core';
import { I18nService } from '@kizeo/i18n/data-access';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'kizeo-import-translations-modal',
  templateUrl: './import-translations-modal.component.html',
  styleUrls: ['./import-translations-modal.component.scss']
})
export class ImportTranslationsModalComponent implements OnInit {

  @Input() productId!: string
  @Input() languageId!: string

  placeholder = `{
  "APP_TITLE": "Title of application",
  "APP_SUBTITLE": "Subitle of application",
  "FIRSNAME": "Firsname",
  "LASTNAME": "Lastname",
  ...
}`

  inputValue: string = ''

  parsedValues: {slug: string, translation: string}[] = []

  knownSlugs: string[] = []

  isLoading = false

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly i18nSvc: I18nService,
  ) { }

  async ngOnInit() {
    // this.knownSlugs = (await this.i18nSvc.getDefinitionsByProductId(this.productId))
    //   .map(d => d.slug)
  }

  onInputValueChanged() {
    let input = this.inputValue.trim()
    if (!input) return

    try {
      const allValues = JSON.parse(input) as any[]
      this.parsedValues = Object.entries(allValues).map(v => ({slug: v[0], translation: v[1]}))
    } catch(err) {
      console.warn(err)
    }
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }

  async onImportClicked() {
    this.isLoading = true
    await this.i18nSvc.importTranslations(this.parsedValues, this.productId, this.languageId)
    //this.isLoading = false
    this.modalRef.triggerOk()
  }
}
