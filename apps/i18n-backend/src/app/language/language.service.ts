import { Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateIsDisabledLanguageDto } from './dto/update-is-disabled-language.dto';

@Injectable()
export class LanguageService {
  create(createLanguageDto: CreateLanguageDto) {
    return 'This action adds a new language';
  }

  findAll() {
    return `This action returns all language`;
  }

  findOne(id: string) {
    return `This action returns a #${id} language`;
  }

  updatedIsDisabled(id: string, updateIsDisabledLanguageDto: UpdateIsDisabledLanguageDto) {
    return `This action updates isDisabled for #${id} language`;
  }

  remove(id: string) {
    return `This action removes a #${id} language`;
  }
}
