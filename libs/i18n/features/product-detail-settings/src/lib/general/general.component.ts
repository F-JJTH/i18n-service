import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService, Product } from '@kizeo/i18n/data-access';
import { ZenObservable } from 'zen-observable-ts';

@Component({
  selector: 'kizeo-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit, OnDestroy {

  product!: Product
  _name = ""

  dtStoreSubscription?: ZenObservable.Subscription

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly i18nSvc: I18nService,
  ) { }

  async ngOnInit() {
    const productId = this.route.parent?.parent?.snapshot.data['product'].id
    this.product = (await this.i18nSvc.getProductById(productId))!
    this._name = this.product.name

    this.dtStoreSubscription = this.i18nSvc.observeProductById(productId).subscribe(data => {
      this.product = data.element
      this._name = this.product.name
    })
  }

  ngOnDestroy(): void {
    this.dtStoreSubscription?.unsubscribe()
  }

  async onSaveClicked() {
    await this.i18nSvc.updateProductName(this._name, this.product.id)
  }

  async confirmDelete() {
    await this.i18nSvc.deleteProduct(this.product.id)
    this.router.navigateByUrl('/')
  }
}
