import { StringField } from "../../../decorators/field.decorators"
import { ApiProperty } from "@nestjs/swagger"
import { ValidateNested, IsObject } from 'class-validator'

class DefaultLanguageDto {
  @StringField()
  code: string

  @StringField()
  label: string
}

export class CreateProductDto {
  @StringField()
  name: string

  @ApiProperty({type: () => DefaultLanguageDto})
  @IsObject()
  @ValidateNested()
  defaultLanguage: DefaultLanguageDto
}
