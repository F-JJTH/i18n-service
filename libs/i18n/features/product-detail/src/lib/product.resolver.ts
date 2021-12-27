import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Product } from '@kizeo/i18n/data-access';
import { DataStore } from 'aws-amplify';

@Injectable({providedIn: 'root'})
export class ProductResolver implements Resolve<Product | undefined> {
  resolve(route: ActivatedRouteSnapshot): Promise<Product | undefined> {
    const productId = route.paramMap.get('productId')
    if (!productId) return Promise.resolve(undefined)

    return DataStore.query(Product, productId)
  }
}
