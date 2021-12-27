import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '@kizeo/i18n/data-access';
import { DataStore } from 'aws-amplify';
import { ZenObservable } from 'zen-observable-ts';

@Component({
  selector: 'kizeo-i18n-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})

export class ProductDetailComponent implements OnInit, OnDestroy {
  product?: Product

  dtStoreSubscription?: ZenObservable.Subscription

  constructor(
    private readonly route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.product = this.route.snapshot.data['product']

    this.dtStoreSubscription = DataStore.observe(Product, this.product?.id).subscribe(data => {
      this.product = data.element
    })
  }

  ngOnDestroy(): void {
      this.dtStoreSubscription?.unsubscribe()
  }
}