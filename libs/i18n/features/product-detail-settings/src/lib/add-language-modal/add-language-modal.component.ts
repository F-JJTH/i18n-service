import { Component, Input } from '@angular/core';
import { I18nService, Product } from '@kizeo/i18n/data-access';
import { SelectLanguageOption } from '@kizeo/ui';
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

  isLoading = false

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly i18nSvc: I18nService,
  ) { }

  async onCreateClicked() {
    if (!this.language || !this.product) {
      return
    }

    this.isLoading = true
    await this.i18nSvc.addLanguage(this.language.code, this.language.label, this.product.id)

    this.modalRef.triggerOk()
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }
}
