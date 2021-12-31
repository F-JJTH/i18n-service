import { Component } from '@angular/core';
import { NzModalRef } from "ng-zorro-antd/modal";
import { Auth, DataStore } from 'aws-amplify';
import { Product, Language, CurrentUserService } from '@kizeo/i18n/data-access';

@Component({
  selector: 'kizeo-i18n-create-new-app-modal',
  templateUrl: 'create-new-app-modal.component.html'
})

export class CreateNewAppModalComponent {
  name = ""
  defaultLanguage: {label: string, code: string} | null = null

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly currentUser: CurrentUserService,
  ) {}

  async onCreateClicked() {
    if (!this.name || !this.defaultLanguage) {
      return
    }

    const currentUser: any = await this.currentUser.getPayload()

    const product = await DataStore.save(new Product({
      name: this.name,
      defaultLanguage: this.defaultLanguage.code,
      members: [currentUser.sub],
      authorizations: [{
        id: currentUser.sub,
        email: currentUser.email,
        authorizations: {
          definitions: true,
          deploy: true,
          languages: true,
          translations: ['ALL']
        }
      }]
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
