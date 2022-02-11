import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I18nService, Product } from '@kizeo/i18n/data-access';
import { PublishEnvironment } from '@kizeo/i18n/util';

interface FileListItem {
  Filename: string
  Key: string
  LanguageCode: string
}
interface FileList {
  preprod: FileListItem[]
  prod: FileListItem[]
}

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
  fileList: FileList = {
    preprod: [],
    prod: [],
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly i18nSvc: I18nService,
  ) { }

  async ngOnInit() {
    this.productId = this.route.parent?.parent?.snapshot.data['product'].id

    if (!this.productId) return

    await this.fetch()
    const languages = await this.i18nSvc.getLanguagesByProductId(this.productId)
    this.hasIncompleteTranslations = languages.some(l => l.isRequireTranslatorAction)
  }

  onDownloadTranslationClicked(env: PublishEnvironment, languageCode: string) {
    if (!this.productId) return
    this.i18nSvc.downloadTranslationFileForProduct(this.productId, env, languageCode)
  }

  async fetch() {
    this.product = await this.i18nSvc.getProductById(this.productId!)
    this.fileList = {
      preprod: await this.i18nSvc.listPublishedTranslationsForProduct(this.productId!, 'preprod'),
      prod: await this.i18nSvc.listPublishedTranslationsForProduct(this.productId!, 'prod')
    }
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
