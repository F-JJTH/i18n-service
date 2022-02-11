import { StringField } from "../../../decorators/field.decorators"
import { ApiProperty } from "@nestjs/swagger"
import { ValidateNested, IsObject } from 'class-validator'
import { CreateProductRequest } from "@kizeo/i18n/data-access"

export class DefaultLanguageDto {
  @StringField()
  code: string

  @StringField()
  label: string
}

export class CreateProductDto implements CreateProductRequest{
  @StringField()
  name: string

  @ApiProperty({type: () => DefaultLanguageDto})
  @IsObject()
  @ValidateNested()
  defaultLanguage: DefaultLanguageDto
}
