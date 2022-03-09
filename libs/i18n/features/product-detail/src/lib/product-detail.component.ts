import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentProductService, CurrentUserService, Product } from '@kizeo/i18n/data-access';

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
    public readonly currentProduct: CurrentProductService,
  ) { }

  async ngOnInit() {
    this.product = this.route.snapshot.data['product']

    this.canAccess = await this.currentUser.getAuthorizationsForProduct(this.product)
  }
}
