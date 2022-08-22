import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Definition, I18nService } from '@kizeo/i18n/data-access';
import { NzModalRef } from 'ng-zorro-antd/modal';

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
export class SetPictureModalComponent implements OnInit, AfterViewInit {

  @Input() definition!: Definition

  isLoading = false

  selectedFile?: File

  preview: any

  @ViewChild('textareaPasteFile')
  textareaPasteFile!: ElementRef<HTMLInputElement>

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly i18nSvc: I18nService,
  ) { }

  async ngOnInit() {}

  ngAfterViewInit(): void {
    setTimeout(() => this.textareaPasteFile.nativeElement.focus(), 300)
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }

  onPaste(e: ClipboardEvent) {
    const files = e.clipboardData?.files || []
    if (files.length === 0) return
    this.onValueChanged({target: { files }})
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
