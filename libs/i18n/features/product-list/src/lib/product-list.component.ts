import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentUserService, Product, Language, I18nService, ProductListItem } from '@kizeo/i18n/data-access';
import { ZenObservable } from 'zen-observable-ts';
import { NzModalService } from "ng-zorro-antd/modal";
import { CreateNewAppModalComponent } from "./create-new-app-modal/create-new-app-modal.component";

@Component({
  selector: 'kizeo-i18n-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: ProductListItem[] = []
  productLanguages: {[productId: string]: Language[]} = {}

  canCreateApplication = false
  dtStoreSubscriptions!: ZenObservable.Subscription

  canAccess: any = {}

  isLoading = false

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
    this.dtStoreSubscriptions?.unsubscribe()
  }

  async fetch() {
    this.isLoading = true

    const products = await this.i18nSvc.getProducts()
    this.products = await this.setLandingPageForProductItem(products)

    this.products.forEach(async p => {
      this.productLanguages[p.id] = await this.i18nSvc.getLanguagesByProductId(p.id)
    })

    this.isLoading = false
  }

  onCreateNewApplicationClicked() {
    this.modal.create({
      nzContent: CreateNewAppModalComponent,
      nzOnOk: () => this.fetch()
    })
  }
  
  private async setLandingPageForProductItem(products: Product[]): Promise<ProductListItem[]> {
    const promises = products.map<Promise<ProductListItem>>(p => {
      return new Promise(async (resolve, reject) => {
        const page = await this.currentUser.getLandingPageForProduct(p)
        resolve({
          ...p,
          page
        })
      })
    })

    return Promise.all(promises)
  }
}
