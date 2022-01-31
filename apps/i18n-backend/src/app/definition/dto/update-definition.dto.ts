import { StringField, StringFieldOptional } from "../../../decorators/field.decorators"

export class UpdateDefinitionDto {
  @StringField()
  slug: string

  @StringField()
  defaultValue: string
}
