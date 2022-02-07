import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DefinitionService } from './definition.service';
import { CreateDefinitionDto } from './dto/create-definition.dto';
import { UpdateDefinitionDto } from './dto/update-definition.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ImportDefinitionDto } from './dto/import-definition.dto';
import { UpdateLinkTranslationDto } from './dto/update-link-definition.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFileInput } from '../../interfaces/uploaded-file-input.interface';
import { ApiFileUpload } from '../../decorators/api.decorators';

@ApiTags('Definitions')
@ApiBearerAuth()
@Controller('definition')
export class DefinitionController {
  constructor(private readonly definitionService: DefinitionService) {}

  @ApiOperation({summary: 'Add a definition for a product'})
  @Post()
  create(@Body() createDefinitionDto: CreateDefinitionDto) {
    return this.definitionService.create(createDefinitionDto);
  }

  @ApiOperation({summary: 'Import definitions for a product'})
  @Post('import')
  import(@Body() importDefinitionDto: ImportDefinitionDto) {
    return this.definitionService.import(importDefinitionDto);
  }

  @ApiOperation({summary: 'Update a definition'})
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDefinitionDto: UpdateDefinitionDto
  ) {
    return this.definitionService.update(id, updateDefinitionDto);
  }

  @ApiOperation({summary: 'Update link for definition'})
  @Post(':id/set-link')
  updateIsValid(
    @Param('id') id: string,
    @Body() updateIsValidTranslationDto: UpdateLinkTranslationDto
  ) {
    return this.definitionService.updateLink(id, updateIsValidTranslationDto);
  }

  @ApiOperation({summary: 'Delete a definition'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.definitionService.remove(id);
  }

  @ApiOperation({summary: 'Set/delete picture for definition', description: 'If «file» is missing, the picture is deleted'})
  @ApiFileUpload({name: 'file'})
  @Post(':id/set-picture')
  @UseInterceptors(FileInterceptor('file'))
  setPicture(
    @Param('id') id: string,
    @UploadedFile() file: UploadedFileInput
  ) {
    return this.definitionService.setPicture(id, file);
  }
}
