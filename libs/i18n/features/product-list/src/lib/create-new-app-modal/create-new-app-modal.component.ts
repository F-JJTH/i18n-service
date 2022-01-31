import { Component } from '@angular/core';
import { NzModalRef } from "ng-zorro-antd/modal";
import { CurrentUserService, I18nService } from '@kizeo/i18n/data-access';

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
    private readonly i18nSvc: I18nService,
  ) {}

  async onCreateClicked() {
    if (!this.name || !this.defaultLanguage) {
      return
    }

    await this.i18nSvc.createProduct(this.name, this.defaultLanguage)

    this.modalRef.triggerOk()
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }

}
