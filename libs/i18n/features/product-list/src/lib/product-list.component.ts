import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentUserService, Product, Language } from '@kizeo/i18n/data-access';
import { DataStore } from 'aws-amplify';
import { ZenObservable } from 'zen-observable-ts';
import { NzModalService } from "ng-zorro-antd/modal";
import { CreateNewAppModalComponent } from "./create-new-app-modal/create-new-app-modal.component";

@Component({
  selector: 'kizeo-i18n-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})

export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = []
  productLanguages: {[productId: string]: Language[]} = {}

  canCreateApplication = false
  dtStoreSubscriptions!: ZenObservable.Subscription

  constructor(
    private readonly modal: NzModalService,
    private readonly currentUser: CurrentUserService,
  ) {}

  async ngOnInit() {
    this.fetch()
    this.canCreateApplication = await this.currentUser.isAdmin()
    this.dtStoreSubscriptions = DataStore.observe(Product).subscribe(() => this.fetch())
  }

  ngOnDestroy(): void {
    this.dtStoreSubscriptions.unsubscribe()
  }
  
  async fetch() {
    if (await this.currentUser.isAdmin()) {
      this.products = await DataStore.query(Product)
    } else {
      const user: any = await this.currentUser.getPayload()
      this.products = (await DataStore.query(Product))
        .filter(p => p.members?.includes(user.sub) || false)
    }

    this.products.forEach(async p => {
      const languages = (await DataStore.query(Language)).filter(l => l.product?.id === p.id)
      this.productLanguages[p.id] = languages
    })
  }

  onCreateNewApplicationClicked() {
    this.modal.create({
      nzContent: CreateNewAppModalComponent,
      nzOnOk: () => this.fetch()
    })
  }
}
