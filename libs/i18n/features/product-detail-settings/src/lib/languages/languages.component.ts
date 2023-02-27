import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentProductService, I18nService, Language, Product } from '@kizeo/i18n/data-access';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddLanguageModalComponent } from '../add-language-modal/add-language-modal.component';

@Component({
  selector: 'kizeo-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

  languages: Language[] = []
  product!: Product

  constructor(
    private readonly route: ActivatedRoute,
    private readonly modal: NzModalService,
    private readonly i18nSvc: I18nService,
    private readonly currentProduct: CurrentProductService,
  ) { }

  ngOnInit() {
    this.product = this.route.parent?.parent?.snapshot.data['product']
    this.fetch()
  }

  async fetch() {
    this.languages = await this.i18nSvc.getLanguagesByProductId(this.product.id)
  }

  onAddNewLanguageClicked() {
    this.modal.create({
      nzContent: AddLanguageModalComponent,
      nzComponentParams: {
        product: this.product,
        excludeLanguages: this.languages.map(language => language.code)
      },
      nzOnOk: () => {
        this.fetch()
        this.currentProduct.refresh(this.product.id)
      }
    })
  }

  async onDisabledSwitchToggled(language: Language) {
    const result = await this.i18nSvc.setIsDisabledForLanguage(language.id, !language.isDisabled)
    this.fetch()
  }

  async onDeleteLanguageClicked(language: Language) {
    await this.i18nSvc.deleteLanguage(language.id)
    this.fetch()
  }
}
