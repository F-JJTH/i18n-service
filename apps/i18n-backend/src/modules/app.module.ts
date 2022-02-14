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
import { ServeStaticModule } from '@nestjs/serve-static';
import { HealthModule } from './health/health.module';
import { PublicModule } from './public/public.module';
import { TaskModule } from './task/task.module';
import { join } from 'path';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public')
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        // ormconfig.json content is replaced by ormconfig.prod.json on production build (angular.json -> fileReplacements)
        const typeormConfig = require('./../../ormconfig.json');
        return Object.assign(typeormConfig, {
          host: process.env.TYPEORM_HOST || typeormConfig.host,
          port: process.env.TYPEORM_PORT || typeormConfig.port,
          username: process.env.TYPEORM_USERNAME || typeormConfig.username,
          password: process.env.TYPEORM_PASSWORD || typeormConfig.password,
          database: process.env.TYPEORM_DATABASE || typeormConfig.database,
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
    HealthModule,
    PublicModule,
    TaskModule,
  ],
  controllers: [AppController],
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
