import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationController } from './translation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Translation]),
    ProductModule,
  ],
  controllers: [TranslationController],
  providers: [TranslationService],
})
export class TranslationModule {}
