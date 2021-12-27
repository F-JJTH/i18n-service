import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PredicateAll } from '@aws-amplify/datastore/lib-esm/predicates';
import { Language, Product } from '@kizeo/i18n/data-access';
import { DataStore } from 'aws-amplify';
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
  ) { }

  ngOnInit() {
    this.product = this.route.parent?.parent?.snapshot.data['product']
    this.fetch()
  }

  async fetch() {
    this.languages = (await DataStore.query(Language)).filter(l => l.product?.id === this.product.id)
  }

  async confirmDelete(language: Language) {
    await DataStore.delete(Language, language.id)
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
