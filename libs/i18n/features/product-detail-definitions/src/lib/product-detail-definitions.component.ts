import { Component, OnInit } from '@angular/core';
import { APIService, GetDefinitionQuery, UpdateDefinitionInput } from '@kizeo/i18n/data-access';
import { ProductDetailComponent } from '@kizeo/i18n/features/product-detail';

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

  slug?: string

  defaultValue?: string

  definitions: GetDefinitionQuery[] = []

  editId: string | null = null;

  constructor(
    private readonly parent: ProductDetailComponent,
    private readonly api: APIService,
  ) { }

  ngOnInit() {
    this.fetch()
  }

  fetch() {
    this.api.ListDefinitions({productDefinitionsId: {eq: this.parent.product.id}})
    .then(result => {
      this.definitions = result.items
    })
  }


  startEdit(id: string): void {
    this.endEdit()
    this.editId = id;
  }

  async stopEdit(slug: string, defaultValue: string) {
    if(slug  !== "" && defaultValue  !== ""){
      await this.api.UpdateDefinition({
        id: this.editId,
        slug,
        defaultValue,
      } as UpdateDefinitionInput)
    }
    this.fetch()
    this.editId = null;
  }

  endEdit() {
    this.fetch()
    this.editId = null;
  }

  async confirmDelete(definition: GetDefinitionQuery) {
    await this.api.DeleteDefinition({id: definition.id})
    this.fetch()
  }

  async onAddNewDefinitionClicked() {
    if (!this.slug || !this.defaultValue) {
      return
    }
    await this.api.CreateDefinition({
      defaultValue: this.defaultValue,
      slug: this.slug,
      productDefinitionsId: this.parent.product.id
    })
    this.fetch()
    this.slug = ""
    this.defaultValue = ""
  }

}