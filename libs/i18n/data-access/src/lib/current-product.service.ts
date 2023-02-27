import { Injectable } from '@angular/core';
import { map, BehaviorSubject } from 'rxjs';
import { I18nService } from './i18n.service';
import { Product } from './api.interface';

@Injectable({providedIn: 'root'})
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
  
  constructor(private readonly i18nSvc: I18nService) { }

  set(product: Product) {
    this._product.next(product)
  }

  async refresh(id: string) {
    const product = await this.i18nSvc.getProductById(id)
    this.set(product)
  }
}