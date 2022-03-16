import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentProductService, CurrentUserService, Definition, I18nService, Product } from '@kizeo/i18n/data-access';
import { TranslateService } from '@ngx-translate/core';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ImportDefinitionsModalComponent } from './import-definitions-modal/import-definitions-modal.component';
import { SetLinkModalComponent } from './set-link-modal/set-link-modal.component';
import { SetPictureModalComponent } from './set-picture-modal/set-picture-modal.component';

@Component({
  selector: 'kizeo-i18n-product-detail-definitions',
  templateUrl: './product-detail-definitions.component.html',
  styleUrls: ['./product-detail-definitions.component.scss']
})

export class ProductDetailDefinitionsComponent implements OnInit {

  product!: Product

  slug?: string

  defaultValue?: string

  definitions: Definition[] = []

  editId: string | null = null;

  isEditLinkVisible = false;

  searchSlug = ''

  searchDefaultValue = ''

  filteredResults: Definition[] = []

  isLoading = false

  currentUserIsAdmin = false

  slugAlreadyUsedError = ''

  @ViewChild('slugInput') slugInput!: ElementRef<HTMLInputElement>

  constructor(
    private readonly route: ActivatedRoute,
    private readonly modal: NzModalService,
    private readonly i18nSvc: I18nService,
    private readonly translate: TranslateService,
    private readonly imageSvc: NzImageService,
    private readonly currentProduct: CurrentProductService,
    private readonly currentUser: CurrentUserService,
  ) { }

  async ngOnInit() {
    this.product = this.route.parent?.parent?.snapshot.data['product']
    this.currentUserIsAdmin = await this.currentUser.isAdmin()
    this.fetch()
  }

  async fetch() {
    this.isLoading = true
    this.definitions = await this.i18nSvc.getDefinitionsByProductId(this.product.id)
    this.setFilteredResult()
    this.isLoading = false
  }

  onImportDefinitionsClicked() {
    this.modal.create({
      nzContent: ImportDefinitionsModalComponent,
      nzWidth: 1280,
      nzComponentParams: {
        productId: this.product.id
      },
      nzOnOk: () => {
        this.fetch()
        this.currentProduct.refresh(this.product.id)
      }
    })
  }

  async onDeleteDefinitionClicked(def: Definition) {
    if (!this.currentUserIsAdmin) return
    await this.i18nSvc.deleteDefinition(def.id)
    this.fetch()
  }

  setFilteredResult() {
    this.filteredResults = this.definitions
      .filter(d => d.defaultValue.toLowerCase().includes(this.searchDefaultValue.toLowerCase()))
      .filter(d => d.slug.toLowerCase().includes(this.searchSlug.toLowerCase()))
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

    this.currentProduct.refresh(this.product.id)
  }

  endEdit() {
    this.fetch()
    this.editId = null;
  }

  onSetLinkClicked(definition: Definition) {
    this.modal.create({
      nzContent: SetLinkModalComponent,
      nzComponentParams: { definition },
      nzOnOk: () => this.fetch()
    })
  }

  async onClearLinkClicked(definition: Definition) {
    definition.link = null
    await this.i18nSvc.setLinkForDefinition(definition.id, null)
  }

  onSetPictureClicked(definition: Definition) {
    this.modal.create({
      nzContent: SetPictureModalComponent,
      nzComponentParams: { definition },
      nzOnOk: () => this.fetch()
    })
  }

  async onClearPictureClicked(definition: Definition) {
    definition.pictureKey = null
    definition.pictureUrl = null
    await this.i18nSvc.setPictureForDefinition(definition.id, null)
  }

  onDefinitionImageClicked(definition: Definition) {
    if (!definition.pictureUrl) return

    this.imageSvc.preview([
      { src: definition.pictureUrl, alt: definition.defaultValue }
    ])
  }

  async confirmDelete(definitionId: string) {
    await this.i18nSvc.deleteDefinition(definitionId)
    this.fetch()
  }

  verifySlug(slug: string = '') {
    if (this.definitions.some(d => d.slug.toLowerCase() === slug.toLowerCase())) {
      this.slugAlreadyUsedError = 'error'
      return
    }
    this.slugAlreadyUsedError = ''
  }

  async onAddNewDefinitionClicked() {
    if (!this.slug || !this.defaultValue) return

    await this.i18nSvc.addDefinition(this.slug, this.defaultValue, this.product.id)

    this.fetch()
    this.slug = ""
    this.defaultValue = ""

    this.slugInput.nativeElement.focus()

    this.currentProduct.refresh(this.product.id)
  }
}