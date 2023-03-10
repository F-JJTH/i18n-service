import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Headers,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt'
import { PublishEnvironment } from '@kizeo/i18n/util';
import { User } from '../../decorators/user.decorator';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private jwt: JwtService
  ) {}

  @ApiOperation({summary: 'Create a product'})
  @Post()
  create(@Body() createProductDto: CreateProductDto, @User() user) {
    return this.productService.create(createProductDto, user);
  }

  @ApiOperation({summary: 'Get all products'})
  @Get()
  findAll(@User() user) {
    return this.productService.findAllForMember(user);
  }

  @ApiOperation({summary: 'Get a product by ID'})
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @ApiOperation({summary: 'Update product name'})
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOperation({summary: 'Delete a product'})
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }

  @ApiOperation({summary: 'Add a member to product'})
  @Post(':id/member')
  addMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addMemberDto: AddMemberDto
  ) {
    return this.productService.addMember(id, addMemberDto);
  }

  @ApiOperation({summary: 'Update member authorizations for product'})
  @Patch(':id/member/:memberId')
  updateMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberDto: UpdateMemberDto
  ) {
    return this.productService.updateMember(id, memberId, updateMemberDto);
  }

  @ApiOperation({summary: 'Remove a member from product'})
  @Delete(':id/member/:memberId')
  removeMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('memberId') memberId: string
  ) {
    return this.productService.removeMember(id, memberId);
  }

  @ApiOperation({summary: 'Returns available translations for connected user'})
  @Get(':id/list-available-translations')
  listAvailableTranslations(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user
  ) {
    return this.productService.listAvailableTranslations(id, user)
  }

  @ApiOperation({summary: 'Publish translations of a product for environment ??dev??, ??preprod?? or ??prod??'})
  @Get(':id/publish/:env')
  publishTranslations(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('env') env: PublishEnvironment
  ) {
    return this.productService.publishTranslations(id, env);
  }

  @ApiOperation({summary: 'Get a list of published translations of a product for environment ??dev??, ??preprod?? or ??prod??'})
  @Get(':id/list-published/:env')
  listPublishedTranslations(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('env') env: PublishEnvironment
  ) {
    return this.productService.listPublishedTranslations(id, env);
  }

  @ApiOperation({summary: 'Get the download link for translations file of a product for the given environment and language'})
  @Get(':id/dl-translation/:env/:languageCode')
  async getDownloadLinkForTranslation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('env') env: PublishEnvironment,
    @Param('languageCode') languageCode: string
  ) {
    return {
      link: await this.productService.getDownloadLinkForTranslation(id, env, languageCode)
    }
  }

  @ApiOperation({summary: 'List languages for product'})
  @Get(':id/language')
  getLanguage(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.getLanguage(id);
  }

  @ApiOperation({summary: 'List definitions for product'})
  @Get(':id/definition')
  getDefinition(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.getDefinition(id);
  }

  @ApiOperation({summary: 'List translations for product'})
  @Get(':id/translation')
  getTranslation(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.getTranslation(id);
  }

}
