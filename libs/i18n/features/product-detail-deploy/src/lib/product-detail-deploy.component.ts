import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I18nService, Product } from '@kizeo/i18n/data-access';

@Component({
  selector: 'kizeo-i18n-product-detail-deploy',
  templateUrl: './product-detail-deploy.component.html',
  styleUrls: ['./product-detail-deploy.component.scss'],
})

export class ProductDetailDeployComponent implements OnInit {
  product: Product | undefined
  productId?: string
  hasIncompleteTranslations = false
  isLoadingPreprod = false
  isLoadingProd = false

  constructor(
    private readonly route: ActivatedRoute,
    private readonly i18nSvc: I18nService
  ) { }

  async ngOnInit() {
    this.productId = this.route.parent?.parent?.snapshot.data['product'].id

    if (!this.productId) return

    await this.fetch()
    const languages = await this.i18nSvc.getLanguagesByProductId(this.productId)
    this.hasIncompleteTranslations = languages.some(l => l.isRequireTranslatorAction)
  }

  async fetch() {
    this.product = await this.i18nSvc.getProductById(this.productId!)
  }

  async onPublishPreprodClicked() {
    if (!this.product) return

    this.isLoadingPreprod = true
    await this.i18nSvc.publishPreprodTranslationsForProduct(this.product.id)
    await this.fetch()
    this.isLoadingPreprod = false
  }

  async onPublishProdClicked() {
    if (!this.product) return

    this.isLoadingProd = true
    await this.i18nSvc.publishProdTranslationsForProduct(this.product.id)
    await this.fetch()
    this.isLoadingProd = false
  }
}
