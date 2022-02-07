import { Component, Input, OnInit } from '@angular/core';
import { Definition, I18nService } from '@kizeo/i18n/data-access';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'kizeo-set-picture-modal',
  templateUrl: './set-picture-modal.component.html',
  styleUrls: ['./set-picture-modal.component.scss']
})
export class SetPictureModalComponent implements OnInit {

  @Input() definition!: Definition

  isLoading = false

  selectedFile?: File

  preview: any

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
    await this.i18nSvc.setPictureForDefinition(this.definition.id, this.selectedFile!)
    // this.isLoading = false
    this.modalRef.triggerOk()
  }
  
  async onValueChanged(fileChangedEvent: any) {
    this.selectedFile = fileChangedEvent.target.files[0]
    if (this.selectedFile) {
      this.preview = await getBase64(this.selectedFile)
    }
  }
}
