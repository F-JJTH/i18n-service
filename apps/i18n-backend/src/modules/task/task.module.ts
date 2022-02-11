import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Definition } from '../definition/entities/definition.entity';
import { Language } from '../language/entities/language.entity';
import { Product } from '../product/entities/product.entity';
import { Translation } from '../translation/entities/translation.entity';
import { TaskService } from './task.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Product, Language, Translation, Definition])
  ],
  providers: [TaskService],
})
export class TaskModule {}
