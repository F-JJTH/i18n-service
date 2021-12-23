import { Component, OnInit } from '@angular/core';
import { APIService } from '@kizeo/i18n/appsync';
import { NzModalService } from "ng-zorro-antd/modal";
import { CreateNewAppModalComponent } from "./create-new-app-modal/create-new-app-modal.component";

@Component({
  selector: 'kizeo-i18n-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})

export class ProductListComponent implements OnInit {
  products: any[] = []

  constructor(
    private readonly api: APIService,
    private readonly modal: NzModalService
  ) { }

  ngOnInit() {
    this.fetch()
  }

  fetch() {
    this.api.ListProducts().then(res => {
      this.products = res.items
    })
  }

  onCreateNewApplicationClicked() {
    this.modal.create({
      nzContent:CreateNewAppModalComponent,
      nzOnOk: () => this.fetch()
    })
  }
}
