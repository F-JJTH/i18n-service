import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentProductService, CurrentUserService, I18nService, Product } from '@kizeo/i18n/data-access';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'kizeo-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  product!: Product
  _name = ""
  _isSlackNotificationEnabled = false
  _slackNotificationChannelName: string | undefined = ""
  canDelete = false

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly i18nSvc: I18nService,
    private readonly currentProduct: CurrentProductService,
    private readonly currentUser: CurrentUserService,
    private readonly translate: TranslateService,
    private readonly message: NzMessageService,
  ) { }

  async ngOnInit() {
    const productId = this.route.parent?.parent?.snapshot.data['product'].id
    this.product = (await this.i18nSvc.getProductById(productId))!
    this._name = this.product.name
    this._isSlackNotificationEnabled = this.product.isSlackNotificationEnabled
    this._slackNotificationChannelName = this.product.slackNotificationChannelName
    this.canDelete = await this.currentUser.isAdmin()
  }

  async onSaveClicked() {
    await this.i18nSvc.updateProduct({
      name: this._name,
      isSlackNotificationEnabled: this._isSlackNotificationEnabled,
      slackNotificationChannelName: this._slackNotificationChannelName,
    }, this.product.id)
    this.message.success(this.translate.instant('PRODUCT_UPDATE_SUCCESS_SAVED'))
    this.currentProduct.refresh(this.product.id)
  }

  async confirmDelete() {
    await this.i18nSvc.deleteProduct(this.product.id)
    this.router.navigateByUrl('/')
  }
}
