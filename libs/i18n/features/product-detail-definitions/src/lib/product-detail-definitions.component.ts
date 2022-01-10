import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I18nService, Product } from '@kizeo/i18n/data-access';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ImportDefinitionsModalComponent } from './import-definitions-modal/import-definitions-modal.component';

@Component({
  selector: 'kizeo-i18n-product-detail-definitions',
  templateUrl: './product-detail-definitions.component.html',
  styleUrls: ['./product-detail-definitions.component.scss']
})

export class ProductDetailDefinitionsComponent implements OnInit {

  product!: Product

  slug?: string

  defaultValue?: string

  definitions: {id: string, slug: string, defaultValue: string}[] = []

  editId: string | null = null;

  @ViewChild('slugInput') slugInput!: ElementRef<HTMLInputElement>

  constructor(
    private readonly route: ActivatedRoute,
    private readonly modal: NzModalService,
    private readonly i18nSvc: I18nService,
  ) { }

  async ngOnInit() {
    this.product = this.route.parent?.parent?.snapshot.data['product']
    this.fetch()
  }

  async fetch() {
    this.definitions = (await this.i18nSvc.getDefinitionsByProductId(this.product.id))
      .map(d => ({
        id: d.id,
        slug: d.slug,
        defaultValue: d.defaultValue
      }))
  }

  onImportDefinitionsClicked() {
    this.modal.create({
      nzContent: ImportDefinitionsModalComponent,
      nzWidth: 1280,
      nzComponentParams: {
        productId: this.product.id
      },
      nzOnOk: () => this.fetch()
    })
  }

  startEdit(id: string): void {
    this.endEdit()
    this.editId = id;
  }

  async stopEdit(slug: string, defaultValue: string) {
    if (!slug || !defaultValue || !this.editId) return

    await this.i18nSvc.updateDefinition(this.editId, slug, defaultValue)

    this.fetch()
    this.editId = null;
  }

  endEdit() {
    this.fetch()
    this.editId = null;
  }

  async confirmDelete(definitionId: string) {
    await this.i18nSvc.deleteDefinition(definitionId)
    this.fetch()
  }

  async onAddNewDefinitionClicked() {
    if (!this.slug || !this.defaultValue) return

    if (this.definitions.some(d => d.slug === this.slug)) {
      alert('This SLUG is already used')
      return
    }

    await this.i18nSvc.addDefinition(this.slug, this.defaultValue, this.product.id)

    this.fetch()
    this.slug = ""
    this.defaultValue = ""

    this.slugInput.nativeElement.focus()
  }
}