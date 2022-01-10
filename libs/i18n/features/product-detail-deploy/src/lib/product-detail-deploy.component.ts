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
  hasIncompleteTranslations = false

  constructor(
    private readonly route: ActivatedRoute,
    private readonly i18nSvc: I18nService
  ) { }

  async ngOnInit() {
    this.product = this.route.parent?.parent?.snapshot.data['product']

    if (!this.product) return

    const languages = await this.i18nSvc.getLanguagesByProductId(this.product.id)
    this.hasIncompleteTranslations = languages.some(l => l.isRequireTranslatorAction)
  }
}
