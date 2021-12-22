import {Component, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import {APIService} from "@kizeo/i18n/appsync";

@Component({
  selector: 'create-new-app-modal',
  templateUrl: 'create-new-app-modal.component.html'
})

export class CreateNewAppModalComponent implements OnInit {
  name=""
  defaultLanguage= {name:"français", code:"fr-FR"}

  constructor(
    private readonly modalRef:NzModalRef,
    private readonly api: APIService) {

  }

  ngOnInit() {
  }

  async onCreateClicked() {
    const product = await this.api.CreateProduct({name:this.name, defaultLanguage:this.defaultLanguage.code})
    const language = await this.api.CreateLanguage({code:this.defaultLanguage.code, name:this.defaultLanguage.name, productLanguagesId:product.id})
    this.modalRef.close()
  }

  onCancelClicked() {
    this.modalRef.destroy()
  }

}
