import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Definition, Language, Product, Translation } from '@kizeo/i18n/data-access';
import { DataStore } from 'aws-amplify';

@Component({
  selector: 'kizeo-i18n-product-detail-definitions',
  templateUrl: './product-detail-definitions.component.html',
  styles: [`
      .ant-form-item-label {
        text-align: left;
      }

      .ant-form, nz-table {
        margin: 15px;
      }
  `]
})

export class ProductDetailDefinitionsComponent implements OnInit {

  product!: Product

  slug?: string

  defaultValue?: string

  definitions: {id: string, slug: string, defaultValue: string}[] = []

  editId: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
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

    const definition = await DataStore.save(new Definition({
      defaultValue: this.defaultValue,
      slug: this.slug,
      product: this.product
    }))

    const languages = (await DataStore.query(Language))
      .filter(d => d.product?.id === this.product.id)

    languages.forEach(language => {
      const value = language.isDefault ? definition.defaultValue : ""
      DataStore.save(new Translation({
        definition,
        language,
        value
      }))
    })

    this.fetch()
    this.slug = ""
    this.defaultValue = ""
  }
}