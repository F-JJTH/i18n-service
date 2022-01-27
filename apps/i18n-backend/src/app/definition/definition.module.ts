import { Module } from '@nestjs/common';
import { DefinitionService } from './definition.service';
import { DefinitionController } from './definition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Definition } from './entities/definition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Definition])],
  controllers: [DefinitionController],
  providers: [DefinitionService],
})
export class DefinitionModule {}
