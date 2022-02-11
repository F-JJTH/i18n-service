import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublishEnvironment } from '@kizeo/i18n/util';

@ApiTags('Global')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({summary: 'Check API health'})
  @Get('/public/health-check')
  getHealthCheck() {
    return this.appService.getHealthCheck();
  }

  @ApiOperation({summary: 'Get translations for clients'})
  @Get('/public/product/:id/:env/translation/:code')
  getTranslations(
    @Param('id') id: string,
    @Param('env') env: PublishEnvironment,
    @Param('code') code: string,
  ) {
    return this.appService.getTranslationsForClients(id, env, code)
  }

  @ApiOperation({summary: 'Get languages for clients'})
  @Get('/public/product/:id/:env/languages')
  getLanguages(
    @Param('id') id: string,
    @Param('env') env: PublishEnvironment,
  ) {
    return this.appService.getLanguagesForClients(id, env)
  }

  @ApiOperation({summary: 'Get user list'})
  @Get('/user')
  listUsers() {
    return this.appService.listUsers()
  }
}
