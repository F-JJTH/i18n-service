import { StringField } from "../../../decorators/field.decorators"
import { ApiProperty } from "@nestjs/swagger"
import { ValidateNested, IsArray } from 'class-validator'
import { UpdateTranslationRequest } from "@kizeo/i18n/data-access"

class TranslationItem {
  @StringField()
  id: string

  @StringField()
  value: string
}

export class UpdateTranslationDto implements UpdateTranslationRequest{
  @ApiProperty({type: [TranslationItem]})
  @IsArray({each: true})
  @ValidateNested()
  translationItems: TranslationItem[]
}
