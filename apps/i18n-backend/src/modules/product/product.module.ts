import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MemberAuthorization } from './entities/member-authorization.entity';
import { Language } from '../language/entities/language.entity';
import { Translation } from '../translation/entities/translation.entity';
import { Definition } from '../definition/entities/definition.entity';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, MemberAuthorization, Language, Translation, Definition]),
    JwtModule.register({}),
    S3Module,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
