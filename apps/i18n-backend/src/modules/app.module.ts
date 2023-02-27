import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LanguageModule } from './language/language.module';
import { TranslationModule } from './translation/translation.module';
import { DefinitionModule } from './definition/definition.module';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { environment } from '../environments/environment';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HealthModule } from './health/health.module';
import { PublicModule } from './public/public.module';
import { TaskModule } from './task/task.module';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        AWS_COGNITO_CLIENT_ID: Joi.string().required(),
        AWS_COGNITO_USER_POOL_ID: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_DEFAULT_REGION: Joi.string().required(),
        AWS_BUCKET_NAME_PUBLIC: Joi.string().required(),
        SENTRY_DSN: Joi.string(),
        TYPEORM_CONNECTION: Joi.string().required(),
        TYPEORM_HOST: Joi.string().required(),
        TYPEORM_PORT: Joi.number().required(),
        TYPEORM_USERNAME: Joi.string().required(),
        TYPEORM_PASSWORD: Joi.string().required(),
        TYPEORM_DATABASE: Joi.string().required(),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public')
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configSvc: ConfigService) => {
        return Object.assign({}, {
          type: configSvc.get('TYPEORM_CONNECTION'),
          host: configSvc.get('TYPEORM_HOST'),
          port: configSvc.get('TYPEORM_PORT'),
          username: configSvc.get('TYPEORM_USERNAME'),
          password: configSvc.get('TYPEORM_PASSWORD'),
          database: configSvc.get('TYPEORM_DATABASE'),
          autoLoadEntities: true,
        });
      },
    }),
    TypeOrmModule.forFeature([Product]),
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
    HealthModule,
    PublicModule,
    TaskModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useValue: new SentryInterceptor(),
    },
  ],
})
export class AppModule {}
