import { Component, Input, OnInit } from '@angular/core';
import { I18nService } from '@kizeo/i18n/data-access';
import { flattenObject } from '@kizeo/i18n/util';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'kizeo-import-definitions-modal',
  templateUrl: './import-definitions-modal.component.html',
  styleUrls: ['./import-definitions-modal.component.scss']
})
export class ImportDefinitionsModalComponent implements OnInit {

  @Input() productId!: string

  placeholder = `{
    "APP_TITLE": "Title of application",
    "APP_SUBTITLE": "Subitle of application",
    "FIRSNAME": "Firsname",
    "LASTNAME": "Lastname",
    ...
}`

  inputValue: string = ''

  parsedValues: {slug: string, defaultValue: string}[] = []

  knownSlugs: string[] = []

  isLoading = false

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly i18nSvc: I18nService,
  ) { }

  async ngOnInit() {
    this.knownSlugs = (await this.i18nSvc.getDefinitionsByProductId(this.productId))
      .map(d => d.slug.toLowerCase())
  }

  onInputValueChanged() {
    let input = this.inputValue.trim()
    if (!input) return

    try {
      const allValues = JSON.parse(input) as any
      const allValuesFlat = flattenObject(allValues)
      this.parsedValues = Object.entries(allValuesFlat)
        .map(v => ({slug: v[0], defaultValue: v[1] as string}))
        .filter(v => !this.knownSlugs.includes(v.slug.toLowerCase()))
    } catch(err) {
      console.warn(err)
    }
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }

  async onImportClicked() {
    this.isLoading = true
    await this.i18nSvc.importDefinitions(this.parsedValues, this.productId)
    //this.isLoading = false
    this.modalRef.triggerOk()
  }
}
