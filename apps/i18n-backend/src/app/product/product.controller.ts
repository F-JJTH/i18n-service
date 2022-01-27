import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({summary: 'Create a product'})
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({summary: 'Get all products'})
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({summary: 'Get a product by ID'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @ApiOperation({summary: 'Update product name'})
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOperation({summary: 'Delete a product'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @ApiOperation({summary: 'Add a member to product'})
  @Post(':id/member')
  addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto
  ) {
    this.productService.addMember(id, addMemberDto);
  }

  @ApiOperation({summary: 'Update member authorizations for product'})
  @Patch(':id/member/:memberId')
  updateMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberDto: UpdateMemberDto
  ) {
    this.productService.updateMember(id, memberId, updateMemberDto);
  }

  @ApiOperation({summary: 'Remove a member from product'})
  @Delete(':id/member/:memberId')
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string
  ) {
    this.productService.removeMember(id, memberId);
  }

  @ApiOperation({summary: 'Publish translations of a product for environment «preprod» or «prod»'})
  @Get(':id/publish/:env')
  publishTranslations(
    @Param('id') id: string,
    @Param('env') env: string
  ) {
    this.productService.publishTranslations(id, env);
  }

  @ApiOperation({summary: 'List languages for product'})
  @Get(':id/language')
  getLanguage(@Param('id') id: string) {
    this.productService.getLanguage(id);
  }

  @ApiOperation({summary: 'List definitions for product'})
  @Get(':id/definition')
  getDefinition(@Param('id') id: string) {
    this.productService.getDefinition(id);
  }

  @ApiOperation({summary: 'List translations for product'})
  @Get(':id/translation')
  getTranslation(@Param('id') id: string) {
    this.productService.getTranslation(id);
  }

}
