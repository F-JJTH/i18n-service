import { Module } from '@nestjs/common';
import { DefinitionService } from './definition.service';
import { DefinitionController } from './definition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Definition } from './entities/definition.entity';
import { Language } from '../language/entities/language.entity';
import { Product } from '../product/entities/product.entity';
import { Translation } from '../translation/entities/translation.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Definition, Language, Product, Translation]),
    ProductModule,
  ],
  controllers: [DefinitionController],
  providers: [DefinitionService],
})
export class DefinitionModule {}
