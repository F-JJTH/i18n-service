import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kizeo-i18n-product-detail',
  template: `
    product detail works!
    <router-outlet></router-outlet>
  `
})

export class ProductDetailComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}