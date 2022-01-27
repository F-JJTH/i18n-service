import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DefinitionService } from './definition.service';
import { CreateDefinitionDto } from './dto/create-definition.dto';
import { UpdateDefinitionDto } from './dto/update-definition.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ImportDefinitionDto } from './dto/import-definition.dto';

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

  @ApiOperation({summary: 'Delete a definition'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.definitionService.remove(id);
  }
}
