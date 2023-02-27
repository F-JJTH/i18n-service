import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kizeo-product-detail-integration',
  templateUrl: './product-detail-integration.component.html',
  styleUrls: ['./product-detail-integration.component.less']
})
export class ProductDetailIntegrationComponent {
  productId = ''

  constructor(private readonly route: ActivatedRoute) {
    this.productId = this.route.parent?.parent?.snapshot.data['product'].id
  }
}