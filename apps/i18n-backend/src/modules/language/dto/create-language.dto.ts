import { CreateLanguageRequest } from "@kizeo/i18n/data-access"
import { StringField } from "../../../decorators/field.decorators"

export class CreateLanguageDto implements CreateLanguageRequest {
  @StringField()
  languageCode: string

  @StringField()
  languageLabel: string

  @StringField()
  productId: string
}
