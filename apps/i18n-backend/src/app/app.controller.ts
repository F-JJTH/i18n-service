import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

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
    @Param('env') env: string,
    @Param('code') code: string,
  ) {
    return `Returns translations for product #${id} with environment ${env} and language ${code}`;
  }

  @ApiOperation({summary: 'Get languages for clients'})
  @Get('/public/product/:id/:env/languages')
  getLanguages(
    @Param('id') id: string,
    @Param('env') env: string,
  ) {
    return `Returns languages available for product #${id} with environment ${env}`;
  }
}
