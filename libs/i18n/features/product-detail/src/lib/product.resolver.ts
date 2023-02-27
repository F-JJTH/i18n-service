import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { CurrentProductService, I18nService, Product } from '@kizeo/i18n/data-access';

@Injectable({providedIn: 'root'})
export class ProductResolver implements Resolve<Product | undefined> {
  constructor(
    private readonly router: Router,
    private readonly i18nSvc: I18nService,
    private readonly currentProduct: CurrentProductService,
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<Product | undefined> {
    const productId = route.paramMap.get('productId')
    if (!productId) {
      this.router.navigateByUrl('/')
      return
    }

    const product = await this.i18nSvc.getProductById(productId!)

    if (!product) {
      this.router.navigateByUrl('/')
      return
    }

    this.currentProduct.set(product)

    return product!
  }
}
