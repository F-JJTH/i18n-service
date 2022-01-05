import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Definition, I18nService, Language, Product, Translation } from '@kizeo/i18n/data-access';
import { DataStore, Predicates } from 'aws-amplify';
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
    this.definitions = (await DataStore.query(Definition))
      .filter(d => d.product?.id === this.product.id)
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
    if (!slug || !defaultValue) return

    const definition = await DataStore.query(Definition, this.editId!)
    await DataStore.save(Definition.copyOf(definition!, updated => {
      updated.slug = slug,
      updated.defaultValue = defaultValue
    }))

    const translations = (await DataStore.query(Translation))
      .filter(t => t.definition.id === definition!.id)
    
    let promises: Promise<any>[] = []
    translations.forEach(t => {
      promises.push(
        DataStore.save(
          Translation.copyOf(t, updated => {
            if (t.language.isDefault) {
              updated.value = defaultValue
            }
            updated.isRequireTranslatorAction = t.language.isDefault ? false : true
          })
        )
      )

      if (!t.language.isDefault) {
        promises.push(
          DataStore.save(
            Language.copyOf(t.language!, updated => {
              updated.isRequireTranslatorAction = true
            })
          )
        )
      }
    })
    await Promise.all(promises)

    this.fetch()
    this.editId = null;
  }

  endEdit() {
    this.fetch()
    this.editId = null;
  }

  async confirmDelete(definitionId: string) {
    const definition = await DataStore.query(Definition, definitionId)
    await DataStore.delete(definition!)
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