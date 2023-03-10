import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Definition } from '../definition/entities/definition.entity';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { Translation } from '../translation/entities/translation.entity';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateIsDisabledLanguageDto } from './dto/update-is-disabled-language.dto';
import { Language } from './entities/language.entity';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Product)
    private readonly product: Repository<Product>,
    @InjectRepository(Language)
    private readonly language: Repository<Language>,
    @InjectRepository(Translation)
    private readonly translation: Repository<Translation>,
    @InjectRepository(Definition)
    private readonly definition: Repository<Definition>,
    private readonly connection: Connection,
    private readonly productSvc: ProductService,
  ) {}

  async create(createLanguageDto: CreateLanguageDto) {
    const product = await this.product.findOne({ where: { id: createLanguageDto.productId } })
    if (!product) {
      throw new NotFoundException()
    }

    const definitions = await this.definition.find({
      where: {
        product: {
          id: product.id
        }
      }
    })

    const createOptions = this.language.create({
      code: createLanguageDto.languageCode,
      name: createLanguageDto.languageLabel,
      isDefault: false,
      isDisabled: false,
      isRequireTranslatorAction: definitions.length ? true : false,
      product,
    })
    const language = await this.language.save(createOptions)
    
    const createTranslationOptions = definitions.map(definition => {
      return this.translation.create({
        definition,
        language,
        product,
        value: undefined,
        isRequireTranslatorAction: true
      })
    })
    await this.connection.createQueryBuilder()
      .insert()
      .into(Translation)
      .values(createTranslationOptions)
      .execute()

    this.productSvc.publishTranslations(createLanguageDto.productId, 'dev')
    return language
  }

  findAll() {
    return this.language.find();
  }

  findOne(id: string) {
    return this.language.findOne({ where: { id } });
  }

  async updatedIsDisabled(id: string, updateIsDisabledLanguageDto: UpdateIsDisabledLanguageDto) {
    const language = await this.language.findOne({
      where: { id },
      relations: ['product']
    })
    if (!language) {
      throw new NotFoundException()
    }

    await this.language.save({
      ...language,
      isDisabled: updateIsDisabledLanguageDto.isDisabled
    })

    this.productSvc.publishTranslations(language.product.id, 'dev')
    return this.language.findOne({ where: { id } });
  }

  async delete(id: string) {
    const language = await this.language.findOne({ where: { id } });
    if (language) {
      const translations = await this.translation.find({
        where: {
          language: {
            id: language.id
          }
        }
      })
      await this.translation.remove(translations)
      await this.language.remove(language)
    }

    return {success: true}
  }
}
