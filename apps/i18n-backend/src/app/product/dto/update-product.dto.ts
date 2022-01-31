import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto, DefaultLanguageDto } from './create-product.dto';
import { StringField } from "../../../decorators/field.decorators"
import { ApiProperty } from "@nestjs/swagger"
import { ValidateNested, IsObject, IsOptional } from 'class-validator'

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @StringField()
  name: string

  @ApiProperty({type: () => DefaultLanguageDto, required: false})
  @IsObject()
  @IsOptional()
  @ValidateNested()
  defaultLanguage: DefaultLanguageDto
}
