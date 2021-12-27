import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { APIService, GetProductQuery } from '@kizeo/i18n/data-access';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<GetProductQuery> {
  constructor(private readonly api: APIService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<GetProductQuery> {
    return this.api.GetProduct(route.paramMap.get('productId')!)
  }
}
