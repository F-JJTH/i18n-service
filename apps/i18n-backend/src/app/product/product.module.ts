import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MemberAuthorization } from './entities/member-authorization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, MemberAuthorization])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
