import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentUserService, Product, Language, I18nService } from '@kizeo/i18n/data-access';
import { ZenObservable } from 'zen-observable-ts';
import { NzModalService } from "ng-zorro-antd/modal";
import { CreateNewAppModalComponent } from "./create-new-app-modal/create-new-app-modal.component";

type ProductItem = Product & {page: string}

@Component({
  selector: 'kizeo-i18n-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: ProductItem[] = []
  productLanguages: {[productId: string]: Language[]} = {}

  canCreateApplication = false
  dtStoreSubscriptions!: ZenObservable.Subscription

  canAccess: any = {}

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
      const products = await this.i18nSvc.getProducts()
      this.products = products.map(p => ({
        ...p,
        page: 'definitions'
      }))
    } else {
      const user: any = await this.currentUser.getPayload()
      const products = await this.i18nSvc.getProductsForMember(user.sub)
      this.products = await this.canAccessProductItem(products)
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

  async canAccessProductItem(products: Product[]): Promise<ProductItem[]> {
    const promises = products.map<Promise<ProductItem>>(p => {
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
