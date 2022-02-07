import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ProductModule,
    LanguageModule,
    TranslationModule,
    DefinitionModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
