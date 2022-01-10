import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentUserService, Product, Language, I18nService } from '@kizeo/i18n/data-access';
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
    private readonly i18nSvc: I18nService,
  ) {}

  async ngOnInit() {
    this.fetch()
    this.canCreateApplication = await this.currentUser.isAdmin()
    this.dtStoreSubscriptions = this.i18nSvc.observeProducts().subscribe(() => this.fetch())
  }

  ngOnDestroy(): void {
    this.dtStoreSubscriptions.unsubscribe()
  }
  
  async fetch() {
    if (await this.currentUser.isAdmin()) {
      this.products = await this.i18nSvc.getProducts()
    } else {
      const user: any = await this.currentUser.getPayload()
      this.products = await this.i18nSvc.getProductsForMember(user.sub)
    }

    this.products.forEach(async p => {
      this.productLanguages[p.id] = await this.i18nSvc.getLanguagesByProductId(p.id)
    })
  }

  onCreateNewApplicationClicked() {
    this.modal.create({
      nzContent: CreateNewAppModalComponent,
      nzOnOk: () => this.fetch()
    })
  }
}
