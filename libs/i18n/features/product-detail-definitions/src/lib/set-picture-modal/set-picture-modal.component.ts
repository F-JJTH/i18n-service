import { Component, Input, OnInit } from '@angular/core';
import { Definition, I18nService } from '@kizeo/i18n/data-access';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'kizeo-set-picture-modal',
  templateUrl: './set-picture-modal.component.html',
  styleUrls: ['./set-picture-modal.component.scss']
})
export class SetPictureModalComponent implements OnInit {

  @Input() definition!: Definition

  isLoading = false

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly i18nSvc: I18nService,
  ) { }

  async ngOnInit() {}

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }

  async onSaveClicked() {
    this.isLoading = true
    alert('FIXME: not yet implemented')
    // await this.i18nSvc.setLinkForDefinition(this.definition.id, this.link)
    //this.isLoading = false
    this.modalRef.triggerOk()
  }
}
