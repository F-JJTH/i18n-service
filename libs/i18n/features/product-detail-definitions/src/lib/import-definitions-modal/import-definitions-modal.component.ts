import { Component, Input, OnInit } from '@angular/core';
import { Definition, I18nService } from '@kizeo/i18n/data-access';
import { DataStore } from 'aws-amplify';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'kizeo-import-definitions-modal',
  templateUrl: './import-definitions-modal.component.html',
  styleUrls: ['./import-definitions-modal.component.scss']
})
export class ImportDefinitionsModalComponent implements OnInit {

  @Input() productId!: string

  placeholder = `[
  {"slug": "APP_TITLE", "defaultValue": "Title of application"},
  {"slug": "APP_SUBTITLE", "defaultValue": "Subitle of application"},
  {"slug": "FIRSNAME", "defaultValue": "Firsname"},
  {"slug": "LASTNAME", "defaultValue": "Lastname"},
  ...
]`

  inputValue: string = ''

  parsedValues: {slug: string, defaultValue: string}[] = []

  knownSlugs: string[] = []

  isLoading = false

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly i18nSvc: I18nService,
  ) { }

  async ngOnInit() {
    this.knownSlugs = (await DataStore.query(Definition))
    .filter(d => d.product?.id === this.productId)
    .map(d => d.slug)
  }

  onInputValueChanged() {
    let input = this.inputValue.trim()
    if (!input) return

    try {
      const allValues = JSON.parse(input) as {slug: string, defaultValue: string}[]
      this.parsedValues = allValues.filter(v => !this.knownSlugs.includes(v.slug))
      
    } catch(err) {
      console.warn(err)
    }
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }

  async onImportClicked() {
    this.isLoading = true
    await Promise.all(this.parsedValues.map(v => {
      return this.i18nSvc.addDefinition(v.slug, v.defaultValue, this.productId)
    }))
    //this.isLoading = false
    this.modalRef.triggerOk()
  }
}
