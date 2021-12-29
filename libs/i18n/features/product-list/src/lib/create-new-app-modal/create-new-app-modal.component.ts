import { Component } from '@angular/core';
import { NzModalRef } from "ng-zorro-antd/modal";
import { DataStore } from 'aws-amplify';
import { Product, Language } from '@kizeo/i18n/data-access';

@Component({
  selector: 'kizeo-i18n-create-new-app-modal',
  templateUrl: 'create-new-app-modal.component.html'
})

export class CreateNewAppModalComponent {
  name = ""
  defaultLanguage: {label: string, code: string} | null = null

  constructor(
    private readonly modalRef:NzModalRef,
  ) {}

  async onCreateClicked() {
    if (!this.name || !this.defaultLanguage) {
      return
    }

    const product = await DataStore.save(new Product({
      name: this.name,
      defaultLanguage: this.defaultLanguage.code
    }))

    await DataStore.save(new Language({
      code: this.defaultLanguage.code,
      name: this.defaultLanguage.label,
      isDefault: true,
      product,
      isRequireTranslatorAction: false
    }))

    this.modalRef.triggerOk()
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }

}
