import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { TranslationService } from './translation.service';
import { ImportTranslationDto } from './dto/import-translation.dto';
import { UpdateIsValidTranslationDto } from './dto/update-is-valid-translation.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Translations')
@ApiBearerAuth()
@Controller('translation')
@UseGuards(JwtAuthGuard)
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @ApiOperation({summary: 'Update translations for a product'})
  @Patch()
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIsValidTranslationDto: UpdateIsValidTranslationDto
  ) {
    return this.translationService.updateIsValid(id, updateIsValidTranslationDto);
  }
}
