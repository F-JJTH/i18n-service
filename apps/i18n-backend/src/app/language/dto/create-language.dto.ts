import { StringField } from "../../../decorators/field.decorators"

export class CreateLanguageDto {
  @StringField()
  languageCode: string

  @StringField()
  languageLabel: string

  @StringField()
  productId: string
}
