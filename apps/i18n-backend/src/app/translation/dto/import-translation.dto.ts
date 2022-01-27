import { StringField } from "../../../decorators/field.decorators"
import { ApiProperty } from "@nestjs/swagger"
import { ValidateNested, IsArray } from 'class-validator'

class TranslationsPropDto {
  @StringField()
  slug: string

  @StringField()
  translation: string
}

export class ImportTranslationDto {
  @ApiProperty({type: [TranslationsPropDto]})
  @IsArray({each: true})
  @ValidateNested()
  translations: TranslationsPropDto[]

  @StringField()
  productId: string

  @StringField()
  languageId: string
}
