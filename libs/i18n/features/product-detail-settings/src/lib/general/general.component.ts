import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '@kizeo/i18n/data-access';
import { DataStore } from 'aws-amplify';
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
  ) { }

  async ngOnInit() {
    const productId = this.route.parent?.parent?.snapshot.data['product'].id
    this.product = (await DataStore.query(Product, productId))!
    this._name = this.product.name

    this.dtStoreSubscription = DataStore.observe(Product, productId).subscribe(data => {
      this.product = data.element
      this._name = this.product.name
    })
  }

  ngOnDestroy(): void {
    this.dtStoreSubscription?.unsubscribe()
  }

  async onSaveClicked() {
    const updatedProduct = Product.copyOf(this.product, updated => {
      updated.name = this._name
    })
    await DataStore.save(updatedProduct)
  }

  async confirmDelete() {
    DataStore.delete(this.product)
    this.router.navigateByUrl('/')
  }
}
