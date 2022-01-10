import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I18nService, Language, Product } from '@kizeo/i18n/data-access';
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
  ) { }

  ngOnInit() {
    this.product = this.route.parent?.parent?.snapshot.data['product']
    this.fetch()
  }

  async fetch() {
    this.languages = await this.i18nSvc.getLanguagesByProductId(this.product.id)
  }

  async confirmDelete(language: Language) {
    await this.i18nSvc.deleteLanguage(language.id)
    this.fetch()
  }

  onAddNewLanguageClicked() {
    this.modal.create({
      nzContent: AddLanguageModalComponent,
      nzComponentParams: {
        product: this.product,
        excludeLanguages: this.languages.map(language => language.code)
      },
      nzOnOk: () => this.fetch()
    })
  }
}
