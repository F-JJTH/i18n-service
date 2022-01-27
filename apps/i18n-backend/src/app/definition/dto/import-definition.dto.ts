import { ImportDefinitionRequest } from "@kizeo/i18n/data-access"
import { StringField } from "apps/i18n-backend/src/decorators/field.decorators"
import { ApiProperty } from "@nestjs/swagger"
import { ValidateNested, IsArray } from 'class-validator'

class DefinitionPropDto {
  @StringField()
  slug: string

  @StringField()
  defaultValue: string
}

export class ImportDefinitionDto implements ImportDefinitionRequest {
  @ApiProperty({type: () => [DefinitionPropDto]})
  @IsArray({each: true})
  @ValidateNested()
  definitions: DefinitionPropDto[]

  @StringField()
  productId: string
}
