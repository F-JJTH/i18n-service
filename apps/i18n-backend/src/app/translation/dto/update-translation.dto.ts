import { StringField } from "../../../decorators/field.decorators"
import { ApiProperty } from "@nestjs/swagger"
import { ValidateNested, IsArray } from 'class-validator'

class TranslationItem {
  @StringField()
  id: string

  @StringField()
  value: string
}

export class UpdateTranslationDto {
  @ApiProperty({type: [TranslationItem]})
  @IsArray({each: true})
  @ValidateNested()
  translationItems: TranslationItem[]
}
