import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationController } from './translation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';
import { ProductModule } from '../product/product.module';
import { Language } from '../language/entities/language.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Translation, Language]),
    ProductModule,
  ],
  controllers: [TranslationController],
  providers: [TranslationService],
})
export class TranslationModule {}
