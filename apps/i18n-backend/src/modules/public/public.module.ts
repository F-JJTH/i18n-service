import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { S3Module } from '../s3/s3.module';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

@Module({
  imports: [
    S3Module,
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
