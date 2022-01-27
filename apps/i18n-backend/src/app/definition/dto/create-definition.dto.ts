import { CreateDefinitionRequest } from "@kizeo/i18n/data-access"
import { StringField } from "../../../decorators/field.decorators"

export class CreateDefinitionDto implements CreateDefinitionRequest {
  @StringField()
  slug: string

  @StringField()
  defaultValue: string

  @StringField()
  productId: string
}
