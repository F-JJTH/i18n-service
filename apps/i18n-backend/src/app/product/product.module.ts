import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MemberAuthorization } from './entities/member-authorization.entity';
import { Language } from '../language/entities/language.entity';
import { Translation } from '../translation/entities/translation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, MemberAuthorization, Language, Translation]),
    JwtModule.register({}),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
