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
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateIsDisabledLanguageDto } from './dto/update-is-disabled-language.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Languages')
@ApiBearerAuth()
@Controller('language')
@UseGuards(JwtAuthGuard)
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @ApiOperation({summary: 'Add a language to a product'})
  @Post()
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @ApiOperation({summary: 'Disable/enable a language for a product'})
  @Post(':id/is-disabled')
  updatedIsDisabled(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLanguageDto: UpdateIsDisabledLanguageDto
  ) {
    return this.languageService.updatedIsDisabled(id, updateLanguageDto);
  }
}
