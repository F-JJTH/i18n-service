import {Component, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import {APIService} from "@kizeo/i18n/appsync";

@Component({
  selector: 'create-new-app-modal',
  templateUrl: 'create-new-app-modal.component.html'
})

export class CreateNewAppModalComponent implements OnInit {
  name = ""
  defaultLanguage: {label: string, code: string} | null = null

  constructor(
    private readonly modalRef:NzModalRef,
    private readonly api: APIService) {
  }

  ngOnInit() {
  }

  async onCreateClicked() {
    if (!this.name || !this.defaultLanguage) {
      return
    }

    const product = await this.api.CreateProduct({
      name: this.name,
      defaultLanguage: this.defaultLanguage.code
    })
    await this.api.CreateLanguage({
      code: this.defaultLanguage.code,
      name: this.defaultLanguage.label,
      isDefault: true,
      productLanguagesId: product.id
    })
    this.modalRef.triggerOk()
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }

}
