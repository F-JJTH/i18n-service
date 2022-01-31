import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { Product } from '../product/entities/product.entity';
import { Translation } from '../translation/entities/translation.entity';
import { Definition } from '../definition/entities/definition.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, Product, Translation, Definition]),
    ProductModule,
  ],
  controllers: [LanguageController],
  providers: [LanguageService],
})
export class LanguageModule {}
