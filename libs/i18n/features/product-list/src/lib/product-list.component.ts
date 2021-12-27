import { Component, OnInit } from '@angular/core';
import { Product } from '@kizeo/i18n/data-access';
import { DataStore } from 'aws-amplify';
import { NzModalService } from "ng-zorro-antd/modal";
import { CreateNewAppModalComponent } from "./create-new-app-modal/create-new-app-modal.component";

@Component({
  selector: 'kizeo-i18n-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})

export class ProductListComponent implements OnInit {
  products: Product[] = []

  constructor(
    private readonly modal: NzModalService
  ) {}

  ngOnInit() {
    this.fetch()
  }

  async fetch() {
    this.products = await DataStore.query(Product)
  }

  onCreateNewApplicationClicked() {
    this.modal.create({
      nzContent: CreateNewAppModalComponent,
      nzOnOk: () => this.fetch()
    })
  }
}
