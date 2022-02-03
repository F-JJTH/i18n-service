import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Definition } from '../definition/entities/definition.entity';
import { Language } from '../language/entities/language.entity';
import { ProductService } from '../product/product.service';
import { ImportTranslationDto, TranslationsPropDto } from './dto/import-translation.dto';
import { UpdateIsValidTranslationDto } from './dto/update-is-valid-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { Translation } from './entities/translation.entity';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(Translation)
    private readonly translation: Repository<Translation>,
    @InjectRepository(Language)
    private readonly language: Repository<Language>,
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

  async import(importTranslationDto: ImportTranslationDto) {
    const definitions = await this.productSvc.getDefinition(importTranslationDto.productId)
    // Warning: we must validate importTranslationDto.translations format
    const translationsBySlugMap = new Map<string, {definition: Definition, translationToImport: TranslationsPropDto}>()

    definitions.forEach(definition => {
      const translation = importTranslationDto.translations.find(t => t.slug === definition.slug)
      if (translation) {
        translationsBySlugMap.set(definition.slug, { definition, translationToImport: translation })
      }
    })

    Promise.all(
      Array.from(translationsBySlugMap.entries()).map(async translationBySlug => {
        const translation = await this.translation.findOne({
          where: {
            product: importTranslationDto.productId,
            language: importTranslationDto.languageId,
            definition: translationBySlug[1].definition.id,
          }
        })

        if (translation && !translation.value) {
          await this.translation.update(translation.id, {
            value: translationBySlug[1].translationToImport.translation,
            isValid: false,
            isRequireTranslatorAction: false,
          })
        }

        return Promise.resolve()
      })
    )

    const missingTranslationCount = await this.translation.count({
      where: {
        product: importTranslationDto.productId,
        language: importTranslationDto.languageId,
        isRequireTranslatorAction: true
      }
    })
    await this.language.update(importTranslationDto.languageId, {
      isRequireTranslatorAction: missingTranslationCount > 0 ? true : false
    })

    this.productSvc.publishTranslations(importTranslationDto.productId, 'dev')
    return {success: true};
  }

  async remove(id: string) {
    const translation = await this.translation.findOne(id);
    return this.translation.remove(translation);
  }
}
