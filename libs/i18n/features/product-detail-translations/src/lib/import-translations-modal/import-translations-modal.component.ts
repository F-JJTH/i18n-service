import { Component, Input, OnInit } from '@angular/core';
import { I18nService } from '@kizeo/i18n/data-access';
import { flattenObject } from '@kizeo/i18n/util';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'kizeo-import-translations-modal',
  templateUrl: './import-translations-modal.component.html',
  styleUrls: ['./import-translations-modal.component.scss']
})
export class ImportTranslationsModalComponent implements OnInit {

  @Input() productId!: string
  @Input() languageId!: string
  @Input() languageCode!: string
  @Input() languageName!: string

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

  // flattenObj(obj: any, parent: any = null, res: any = {}) {
  //   for (const key of Object.keys(obj)) {
  //     const propName = parent ? parent + '.' + key : key;
  //     if (typeof obj[key] === 'object') {
  //       this.flattenObj(obj[key], propName, res);
  //     } else {
  //       res[propName] = obj[key];
  //     }
  //   }
  //   return res;
  // }

  onInputValueChanged() {
    let input = this.inputValue.trim()
    if (!input) return

    try {
      const allValues = JSON.parse(input) as any
      const allValuesFlat = flattenObject(allValues)
      this.parsedValues = Object.entries(allValuesFlat).map(v => ({slug: v[0], translation: v[1] as string}))
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
