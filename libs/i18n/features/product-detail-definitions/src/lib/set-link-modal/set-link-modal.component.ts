import { Component, Input, OnInit } from '@angular/core';
import { Definition, I18nService } from '@kizeo/i18n/data-access';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'kizeo-set-link-modal',
  templateUrl: './set-link-modal.component.html',
  styleUrls: ['./set-link-modal.component.scss']
})
export class SetLinkModalComponent implements OnInit {

  @Input() definition!: Definition

  isLoading = false

  link: string | null = null

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly i18nSvc: I18nService,
  ) { }

  async ngOnInit() {
    this.link = this.definition.link
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }

  async onSaveClicked() {
    this.isLoading = true
    await this.i18nSvc.setLinkForDefinition(this.definition.id, this.link)
    //this.isLoading = false
    this.modalRef.triggerOk()
  }
}
