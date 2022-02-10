import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LanguageModule } from './language/language.module';
import { TranslationModule } from './translation/translation.module';
import { DefinitionModule } from './definition/definition.module';
import { ProductModule } from './product/product.module';
import { JwtStrategy } from './jwt.strategy';
import { Product } from './product/entities/product.entity';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { environment } from '../environments/environment';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        AWS_COGNITO_USER_POOL_ID: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_DEFAULT_REGION: Joi.string().required(),
        AWS_BUCKET_NAME_PUBLIC: Joi.string().required(),
        SENTRY_DSN: Joi.string(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        // ormconfig.json content is replaced by ormconfig.prod.json on production build (angular.json -> fileReplacements)
        const typeormConfig = require('./../../ormconfig.json');
        return Object.assign(typeormConfig, {
          autoLoadEntities: true,
        });
      },
    }),
    TypeOrmModule.forFeature([Product]),
    JwtModule.register({
      secret: 'noop',
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSvc: ConfigService) => ({
        enabled: environment.production,
        dsn: configSvc.get('SENTRY_DSN'),
        environment: environment.name,
      }),
    }),
    ProductModule,
    LanguageModule,
    TranslationModule,
    DefinitionModule,
    TerminusModule,
    S3Module,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useValue: new SentryInterceptor(),
    },
  ],
})
export class AppModule {}
