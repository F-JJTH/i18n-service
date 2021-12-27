import { Component, OnInit } from '@angular/core';
import { APIService, GetLanguageQuery } from '@kizeo/i18n/data-access';
import { ProductDetailComponent } from '@kizeo/i18n/features/product-detail';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddLanguageModalComponent } from '../add-language-modal/add-language-modal.component';

@Component({
  selector: 'kizeo-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

  languages: GetLanguageQuery[] = []

  constructor(
    private readonly parent: ProductDetailComponent,
    private readonly api: APIService,
    private readonly modal: NzModalService,
  ) { }

  ngOnInit() {
    this.fetch()
  }

  fetch() {
    this.api.ListLanguages({productLanguagesId: {eq: this.parent.product.id}})
    .then(result => {
      this.languages = result.items
    })
  }

  async confirmDelete(language: GetLanguageQuery) {
    await this.api.DeleteLanguage({id: language.id})
    this.fetch()
  }

  onAddNewLanguageClicked() {
    this.modal.create({
      nzContent: AddLanguageModalComponent,
      nzComponentParams: {
        productId: this.parent.product.id,
        excludeLanguages: this.languages.map(language => language.code)
      },
      nzOnOk: () => this.fetch()
    })
  }
}
