import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentProductService, CurrentUserService, I18nService, Product } from '@kizeo/i18n/data-access';

@Component({
  selector: 'kizeo-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  product!: Product
  _name = ""
  canDelete = false

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly i18nSvc: I18nService,
    private readonly currentProduct: CurrentProductService,
    private readonly currentUser: CurrentUserService,
  ) { }

  async ngOnInit() {
    const productId = this.route.parent?.parent?.snapshot.data['product'].id
    this.product = (await this.i18nSvc.getProductById(productId))!
    this._name = this.product.name
    this.canDelete = await this.currentUser.isAdmin()
  }

  async onSaveClicked() {
    await this.i18nSvc.updateProductName(this._name, this.product.id)
    this.currentProduct.refresh(this.product.id)
  }

  async confirmDelete() {
    await this.i18nSvc.deleteProduct(this.product.id)
    this.router.navigateByUrl('/')
  }
}
