import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto, DefaultLanguageDto } from './create-product.dto';
import { StringField } from "../../../decorators/field.decorators"
import { ApiProperty } from "@nestjs/swagger"
import { ValidateNested, IsObject, IsOptional } from 'class-validator'
import { UpdateProductRequest } from '@kizeo/i18n/data-access';

export class UpdateProductDto implements UpdateProductRequest {
  @StringField()
  name: string

  @ApiProperty({type: () => DefaultLanguageDto, required: false})
  @IsObject()
  @IsOptional()
  @ValidateNested()
  defaultLanguage: DefaultLanguageDto
}
