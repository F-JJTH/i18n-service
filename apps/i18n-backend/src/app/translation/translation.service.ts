import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { ImportTranslationDto } from './dto/import-translation.dto';
import { UpdateIsValidTranslationDto } from './dto/update-is-valid-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { Translation } from './entities/translation.entity';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(Translation)
    private readonly translation: Repository<Translation>,
    private readonly productSvc: ProductService,
  ) {}

  findAll() {
    return this.translation.find();
  }

  findOne(id: string) {
    return this.translation.findOne(id);
  }

  async updateIsValid(id: string, updateIsValidTranslationDto: UpdateIsValidTranslationDto) {
    const translation = await this.translation.findOne(id)
    if (!translation) {
      throw new NotFoundException()
    }

    await this.translation.save({
      ...translation,
      isValid: updateIsValidTranslationDto.isValid
    })
    return this.translation.findOne(id);
  }

  async updateAll(updateTranslationDto: UpdateTranslationDto) {
    if (!updateTranslationDto.translationItems.length) {
      throw new BadRequestException('translationItems must be an array with at least 1 value')
    }

    // Warning: we must validate updateTranslationDto.translationItems format
    const hasInvalidItems = updateTranslationDto.translationItems.some(item => item.id === undefined || item.value === undefined)
    if (hasInvalidItems) {
      throw new BadRequestException('translationItems must be of type {id: string, value: string}[]')
    }

    const updatedTranslations = await Promise.all(
      updateTranslationDto.translationItems.map(item => {
        return this.translation.update(item.id, {
          value: item.value,
          isRequireTranslatorAction: item.value ? false : true
        })
      })
    )

    const translation = await this.translation.findOne(updateTranslationDto.translationItems[0].id, {relations: ['product']})
    if (translation) {
      this.productSvc.publishTranslations(translation.product.id, 'dev')
    }

    return updatedTranslations;
  }

  import(importTranslationDto: ImportTranslationDto) {
    // Warning: we must validate importTranslationDto.translations format
    this.productSvc.publishTranslations(importTranslationDto.productId, 'dev')
    return {message: 'FIXME: not yet implemented'};
  }

  async remove(id: string) {
    const translation = await this.translation.findOne(id);
    return this.translation.remove(translation);
  }
}
