import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Definition } from '../definition/entities/definition.entity';
import { Language } from '../language/entities/language.entity';
import { Product } from '../product/entities/product.entity';
import { Translation } from '../translation/entities/translation.entity';
import { MailService } from './mail.service';
import { TaskService } from './task.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Product, Language, Translation, Definition])
  ],
  providers: [TaskService, MailService],
})
export class TaskModule {}
