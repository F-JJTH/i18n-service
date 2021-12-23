import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetProductQuery } from '@kizeo/i18n/appsync';

@Component({
  selector: 'kizeo-i18n-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})

export class ProductDetailComponent implements OnInit {
  product!: GetProductQuery

  constructor(
    private readonly route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.route.data.subscribe(data => {
      this.product = data['product']
    })
  }
}