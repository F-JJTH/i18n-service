import { Component, Input } from '@angular/core';
import { Language, Product } from '@kizeo/i18n/data-access';
import { SelectLanguageOption } from '@kizeo/ui';
import { DataStore } from 'aws-amplify';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'kizeo-add-language-modal',
  templateUrl: './add-language-modal.component.html',
  styleUrls: ['./add-language-modal.component.scss']
})
export class AddLanguageModalComponent {
  language: SelectLanguageOption | null = null

  @Input() product!: Product

  @Input() excludeLanguages: string[] = []

  constructor(
    private readonly modalRef: NzModalRef,
  ) { }

  async onCreateClicked() {
    if (!this.language || !this.product) {
      return
    }

    await DataStore.save(new Language({
      code: this.language.code,
      name: this.language.label,
      isDefault: false,
      product: this.product
    }))
    this.modalRef.triggerOk()
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }
}
