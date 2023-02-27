import { UpdateDefinitionRequest } from "@kizeo/i18n/data-access"
import { StringField, StringFieldOptional } from "../../../decorators/field.decorators"

export class UpdateDefinitionDto implements UpdateDefinitionRequest {
  @StringField()
  slug: string

  @StringField()
  defaultValue: string
}
