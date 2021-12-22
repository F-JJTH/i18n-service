import { Component, OnInit } from '@angular/core';
import { APIService } from '@kizeo/i18n/appsync';

@Component({
  selector: 'kizeo-i18n-product-list',
  templateUrl: './product-list.component.html'
})

export class ProductListComponent implements OnInit {
  products: any[] = []

  constructor(private readonly api: APIService) { }

  ngOnInit() {
    this.api.ListProducts().then(res => {
      this.products = res.items
    })
  }
}