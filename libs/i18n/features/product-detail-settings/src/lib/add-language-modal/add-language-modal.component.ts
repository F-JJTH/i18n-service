import { Component, Input, OnInit } from '@angular/core';
import { APIService } from '@kizeo/i18n/data-access';
import { SelectLanguageOption } from '@kizeo/ui';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'kizeo-add-language-modal',
  templateUrl: './add-language-modal.component.html',
  styleUrls: ['./add-language-modal.component.scss']
})
export class AddLanguageModalComponent implements OnInit {
  language: SelectLanguageOption | null = null

  @Input() productId?: string

  @Input() excludeLanguages: string[] = []

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly api: APIService,
  ) { }

  ngOnInit() {
  }

  async onCreateClicked() {
    if (!this.language || !this.productId) {
      return
    }
    await this.api.CreateLanguage({
      code: this.language.code,
      name: this.language.label,
      isDefault: false,
      productLanguagesId: this.productId
    })
    this.modalRef.triggerOk()
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }
}
