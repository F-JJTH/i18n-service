import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService, I18nService, Product } from '@kizeo/i18n/data-access';
import { ZenObservable } from 'zen-observable-ts';
import { debounceTime, map, Subject } from 'rxjs';
import { CurrentProductService } from './current-product.service';

@Component({
  selector: 'kizeo-i18n-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})

export class ProductDetailComponent implements OnInit {
  product!: Product

  canAccess = {
    translations: false,
    definitions: false,
    deploy: false,
    settings: false,
  }

  constructor(
    public readonly currentUser: CurrentUserService,
    private readonly route: ActivatedRoute,
    private readonly i18nSvc: I18nService,
    public readonly currentProduct: CurrentProductService,
  ) { }

  async ngOnInit() {
    this.product = this.route.snapshot.data['product']

    this.canAccess = {
      ...(await this.currentUser.getAuthorizationsForProduct(this.product)),
      settings: await this.currentUser.isAdmin()
    }
  }
}
