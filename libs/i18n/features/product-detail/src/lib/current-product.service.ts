import { Injectable } from '@angular/core';
import { I18nService, Product } from '@kizeo/i18n/data-access';
import { map, BehaviorSubject } from 'rxjs';

@Injectable()
export class CurrentProductService {
  public _product: BehaviorSubject<Product> = new BehaviorSubject({} as Product)

  public product$ = this._product
    .asObservable()
    .pipe(
      map(product => {
        return {
          ...product,
          isRequireTranslatorAction: product?.languages!.some(l => l.isRequireTranslatorAction)
        }
      })
    )
  
  constructor(
    private readonly i18nSvc: I18nService,
  ) { }

  set(product: Product) {
    this._product.next(product)
  }

  async refresh(id: string) {
    const product = await this.i18nSvc.getProductById(id)
    this.set(product)
  }
}