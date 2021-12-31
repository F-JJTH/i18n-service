import { Component, OnInit } from '@angular/core';
import { CurrentUserService, Product } from '@kizeo/i18n/data-access';
import { Auth, DataStore } from 'aws-amplify';
import { NzModalService } from "ng-zorro-antd/modal";
import { CreateNewAppModalComponent } from "./create-new-app-modal/create-new-app-modal.component";

@Component({
  selector: 'kizeo-i18n-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})

export class ProductListComponent implements OnInit {
  products: Product[] = []

  canCreateApplication = false

  constructor(
    private readonly modal: NzModalService,
    private readonly currentUser: CurrentUserService,
  ) {}

  async ngOnInit() {
    this.fetch()
    this.canCreateApplication = await this.currentUser.isAdmin()
  }
  
  async fetch() {
    if (await this.currentUser.isAdmin()) {
      this.products = await DataStore.query(Product)
    } else {
      const user: any = await this.currentUser.getPayload()
      this.products = (await DataStore.query(Product))
        .filter(p => p.members?.includes(user.sub) || false)
    }
  }

  onCreateNewApplicationClicked() {
    this.modal.create({
      nzContent: CreateNewAppModalComponent,
      nzOnOk: () => this.fetch()
    })
  }
}
