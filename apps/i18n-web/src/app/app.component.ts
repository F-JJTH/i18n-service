import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
//import { APIService } from '@kizeo/appsync';

@Component({
  selector: 'kizeo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'i18n-web';
  // products: any[] = []


  // constructor(private readonly api: APIService) {
  //   api.OnCreateProductListener.subscribe(value => {
  //     if (value.value.data) {
  //       this.products.unshift(value.value.data.onCreateProduct)
  //     }
  //   })
  // }

  // async ngOnInit() {
  //   const res = await this.api.ListProducts()
  //   console.log(res)
  //   this.products = res.items
  // }

  // createProduct(): void {
  //     this.api.CreateProduct({
  //       defaultLanguage: 'fr-FR',
  //       name: 'Kizeo i18n'
  //     }).then(res => {
  //       console.log(res)
  //     })
  // }
}
