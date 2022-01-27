import { Injectable } from '@nestjs/common';
import { CreateDefinitionDto } from './dto/create-definition.dto';
import { ImportDefinitionDto } from './dto/import-definition.dto';
import { UpdateDefinitionDto } from './dto/update-definition.dto';

@Injectable()
export class DefinitionService {
  create(createDefinitionDto: CreateDefinitionDto) {
    return 'This action adds a new definition';
  }

  findAll() {
    return `This action returns all definition`;
  }

  findOne(id: string) {
    return `This action returns a #${id} definition`;
  }

  update(id: string, updateDefinitionDto: UpdateDefinitionDto) {
    return `This action updates a #${id} definition`;
  }

  remove(id: string) {
    return `This action removes a #${id} definition`;
  }

  import(importDefinitionDto: ImportDefinitionDto) {
    // Warning: we must validate importDefinitionDto.definitions format
    return `This action import definitions`;
  }
}
