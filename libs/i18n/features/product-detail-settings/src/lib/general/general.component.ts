import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService, Product } from '@kizeo/i18n/data-access';
import { CurrentProductService } from 'libs/i18n/features/product-detail/src/lib/current-product.service';

@Component({
  selector: 'kizeo-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  product!: Product
  _name = ""

  // dtStoreSubscription?: ZenObservable.Subscription

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly i18nSvc: I18nService,
    private readonly currentProduct: CurrentProductService,
  ) { }

  async ngOnInit() {
    const productId = this.route.parent?.parent?.snapshot.data['product'].id
    this.product = (await this.i18nSvc.getProductById(productId))!
    this._name = this.product.name
  }

  async onSaveClicked() {
    await this.i18nSvc.updateProductName(this._name, this.product.id)
    this.currentProduct.refresh(this.product.id)
  }

  async confirmDelete() {
    await this.i18nSvc.deleteProduct(this.product.id)
    this.router.navigateByUrl('/')
  }
}
