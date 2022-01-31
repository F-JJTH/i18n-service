import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService, I18nService, Product } from '@kizeo/i18n/data-access';
import { ZenObservable } from 'zen-observable-ts';
import { debounceTime, map, Subject } from 'rxjs';

@Component({
  selector: 'kizeo-i18n-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})

export class ProductDetailComponent implements OnInit, OnDestroy {
  product!: Product

  dtStoreSubscriptions: ZenObservable.Subscription[] = []

  isTranslatorRequireAction = false

  isTranslatorRequireAction$ = new Subject()

  canAccess = {
    translations: false,
    definitions: false,
    deploy: false,
    settings: false,
  }

  constructor(
    private readonly route: ActivatedRoute,
    public readonly currentUser: CurrentUserService,
    private readonly i18nSvc: I18nService,
  ) {
    // this.dtStoreSubscriptions.push(
    //   this.isTranslatorRequireAction$.pipe(
    //     debounceTime(300),
    //     map(async () => {
    //       const languages = await this.i18nSvc.getLanguagesByProductId(this.product.id)
    //       this.isTranslatorRequireAction = languages.some(l => l.isRequireTranslatorAction)
    //     })
    //   ).subscribe()
    // )
  }

  async ngOnInit() {
    this.product = this.route.snapshot.data['product']

    this.canAccess = {
      ...(await this.currentUser.getAuthorizationsForProduct(this.product)),
      settings: await this.currentUser.isAdmin()
    }

    // this.dtStoreSubscriptions.push(
    //   this.i18nSvc.observeProductById(this.product.id).subscribe(data => {
    //     this.product = data.element
    //   })
    // )

    // this.dtStoreSubscriptions.push(
    //   this.i18nSvc.observeLanguages().subscribe(async data => {
    //     if ((data.element as any).productLanguagesId === this.product.id) {
    //       this.isTranslatorRequireAction$.next(data.element)
    //     }
    //   })
    // )

    // this.isTranslatorRequireAction$.next(null)
  }

  ngOnDestroy(): void {
      // this.dtStoreSubscriptions.forEach(sub => sub.unsubscribe())
  }
}
