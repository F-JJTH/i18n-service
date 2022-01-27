import { Injectable } from '@nestjs/common';
import { ImportTranslationDto } from './dto/import-translation.dto';
import { UpdateIsValidTranslationDto } from './dto/update-is-valid-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';

@Injectable()
export class TranslationService {
  create(createTranslationDto) {
    return 'This action adds a new translation';
  }

  findAll() {
    return `This action returns all translation`;
  }

  findOne(id: string) {
    return `This action returns a #${id} translation`;
  }

  updateIsValid(id: string, updateIsValidTranslationDto: UpdateIsValidTranslationDto) {
    return `This action updates a #${id} translation`;
  }

  updateAll(updateTranslationDto: UpdateTranslationDto) {
    // Warning: we must validate updateTranslationDto.translationItems format
    return `This action update translations`;
  }

  import(importTranslationDto: ImportTranslationDto) {
    // Warning: we must validate importTranslationDto.translations format
    return `This action import translations`;
  }

  remove(id: string) {
    return `This action removes a #${id} translation`;
  }
}
