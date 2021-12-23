import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '@kizeo/i18n/appsync';
import { ProductDetailComponent } from '@kizeo/i18n/features/product-detail';

@Component({
  selector: 'kizeo-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  _name = ""

  constructor(
    private readonly api: APIService,
    public readonly parent: ProductDetailComponent,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this._name = this.parent.product.name
  }

  async onSaveClicked() {
    await this.api.UpdateProduct({
      id: this.parent.product.id,
      name: this._name,
    })
    this.parent.product.name = this._name
  }

  async confirmDelete() {
    const product = this.parent.product
    if (product) {
      await this.api.DeleteProduct({id: product.id})
    }

    this.router.navigateByUrl('/')
  }

}
