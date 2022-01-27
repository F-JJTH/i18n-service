import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LanguageModule } from './language/language.module';
import { TranslationModule } from './translation/translation.module';
import { DefinitionModule } from './definition/definition.module';
import { ProductModule } from './product/product.module';
import { getConnectionOptions } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      })
    }),
    /*TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const defaultConfig = {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
          migrations: ["./migrations/*"], //FIXME: check me
        }

        const developmentConf: any = {}
        if (!environment.production) {
          developmentConf.entities = getMetadataArgsStorage().tables.map(tbl => tbl.target)
          developmentConf.migrations = ["apps/i18n-backend/src/migrations/*"] //FIXME
          developmentConf.cli = {
            migrationsDir: "apps/i18n-backend/src/migrations"
          }
        }

        const config = {...defaultConfig, ...developmentConf}

        return config as TypeOrmModuleOptions
      }
    }),*/
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    ProductModule,
    LanguageModule,
    TranslationModule,
    DefinitionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
