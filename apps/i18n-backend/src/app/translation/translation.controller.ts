import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TranslationService } from './translation.service';
import { ImportTranslationDto } from './dto/import-translation.dto';
import { UpdateIsValidTranslationDto } from './dto/update-is-valid-translation.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateTranslationDto } from './dto/update-translation.dto';

@ApiTags('Translations')
@ApiBearerAuth()
@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @ApiOperation({summary: 'Update translations for a product'})
  @Post()
  updateAll(@Body() updateTranslationDto: UpdateTranslationDto) {
    return this.translationService.updateAll(updateTranslationDto);
  }

  @ApiOperation({summary: 'Import translations for a product'})
  @Post('import')
  import(@Body() importTranslationDto: ImportTranslationDto) {
    return this.translationService.import(importTranslationDto);
  }

  @ApiOperation({summary: 'Update valid flag for a translation'})
  @Post(':id/is-valid')
  updateIsValid(
    @Param('id') id: string,
    @Body() updateIsValidTranslationDto: UpdateIsValidTranslationDto
  ) {
    return this.translationService.updateIsValid(id, updateIsValidTranslationDto);
  }
}
