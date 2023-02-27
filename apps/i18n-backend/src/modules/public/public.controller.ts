import { PublishEnvironment } from '@kizeo/i18n/util';
import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicService } from './public.service';

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(private readonly publicSvc: PublicService) {}

  @ApiOperation({summary: 'Get translations for clients'})
  @Get('/product/:id/:env/translation/:code')
  getTranslations(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('env') env: PublishEnvironment,
    @Param('code') code: string,
  ) {
    return this.publicSvc.getTranslationsForClients(id, env, code)
  }

  @ApiOperation({summary: 'Get languages for clients'})
  @Get('/product/:id/:env/languages')
  getLanguages(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('env') env: PublishEnvironment,
  ) {
    return this.publicSvc.getLanguagesForClients(id, env)
  }
}
