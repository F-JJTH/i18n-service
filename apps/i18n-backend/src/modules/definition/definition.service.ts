import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, In } from 'typeorm';
import { Language } from '../language/entities/language.entity';
import { Product } from '../product/entities/product.entity';
import { Translation } from '../translation/entities/translation.entity';
import { Definition } from './entities/definition.entity';
import { CreateDefinitionDto } from './dto/create-definition.dto';
import { ImportDefinitionDto } from './dto/import-definition.dto';
import { UpdateDefinitionDto } from './dto/update-definition.dto';
import { ProductService } from '../product/product.service';
import { UpdateLinkTranslationDto } from './dto/update-link-definition.dto';
import { S3Service } from '../s3/s3.service';
import { UploadedFileInput } from '../../interfaces/uploaded-file-input.interface';

@Injectable()
export class DefinitionService {
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
    private readonly s3Svc: S3Service,
  ) { }

  async create(createDefinitionDto: CreateDefinitionDto) {
    const product = await this.product.findOne(createDefinitionDto.productId, {relations: ['languages']})
    if (!product) {
      throw new NotFoundException()
    }

    const createDefinitionOptions = this.definition.create({
      defaultValue: createDefinitionDto.defaultValue,
      slug: createDefinitionDto.slug,
      product
    })
    const definition = await this.definition.save(createDefinitionOptions)

    const createTranslationOptions = product.languages.map(language => {
      return this.translation.create({
        definition,
        language,
        product,
        value: language.isDefault ? definition.defaultValue : undefined,
        isRequireTranslatorAction: language.isDefault ? false : true
      })
    })
    await this.connection.createQueryBuilder()
      .insert()
      .into(Translation)
      .values(createTranslationOptions)
      .execute()

    await Promise.all(
      product.languages.map(language => {
        return this.language.update(language.id, {
          isRequireTranslatorAction: language.isDefault ? false : true
        })
      })
    )

    this.productSvc.publishTranslations(product.id, 'dev')

    return this.definition.find({
      where: {
        product: product.id
      }
    });
  }

  findAll() {
    return this.definition.find();
  }

  findOne(id: string) {
    return this.definition.findOne(id);
  }

  async update(id: string, updateDefinitionDto: UpdateDefinitionDto) {
    const definition = await this.definition.findOne(id, {relations: ['product']})
    if (!definition) {
      throw new NotFoundException()
    }

    await this.definition.update(definition.id, {
      slug: updateDefinitionDto.slug,
      defaultValue: updateDefinitionDto.defaultValue,
    })

    const translations = await this.translation.find({
      relations: ['language'],
      where: {
        definition
      }
    })
    await Promise.all(
      translations.map(async translation => {
        if (translation.language.isDefault) {
          await this.language.update(translation.language.id, {
            isRequireTranslatorAction: true
          })
        }

        return this.translation.update(translation.id, {
          value: translation.language.isDefault ? updateDefinitionDto.defaultValue : translation.value,
          isRequireTranslatorAction: translation.language.isDefault ? false : true
        })
      })
    )

    this.productSvc.publishTranslations(definition.product.id, 'dev')

    return this.definition.find({
      where: {
        product: definition.product.id
      }
    });
  }

  async updateLink(id: string, updateLinkTranslationDto: UpdateLinkTranslationDto) {
    const definition = await this.definition.findOne(id)
    if (!definition) {
      throw new NotFoundException()
    }

    await this.definition.save({
      ...definition,
      link: updateLinkTranslationDto.link
    })
    return this.definition.findOne(id);
  }

  async remove(id: string) {
    const definition = await this.definition.findOne(id, {relations: ['product']});

    this.productSvc.publishTranslations(definition.product.id, 'dev')

    return this.definition.remove(definition);
  }

  async import(importDefinitionDto: ImportDefinitionDto) {
    const product = await this.product.findOne(importDefinitionDto.productId, {relations: ['languages']})
    if (!product) {
      throw new NotFoundException()
    }

    // Warning: we must validate importDefinitionDto.definitions format
    const hasInvalidItems = importDefinitionDto.definitions.some(item => item.defaultValue === undefined || item.slug === undefined)
    if (hasInvalidItems) {
      throw new BadRequestException('definitions must be of type {defaultValue: string, slug: string}[]')
    }

    // 1. Insert new definitions
    const createDefinitionOptions = importDefinitionDto.definitions.map(definition => {
      return this.definition.create({
        product,
        defaultValue: definition.defaultValue,
        slug: definition.slug
      })
    })
    const result = await this.connection.createQueryBuilder()
      .insert()
      .into(Definition)
      .values(createDefinitionOptions)
      .execute()

    // 2. Insert new translations
    const createdDefinitionIds = result.identifiers.map(i => i.id)
    const createdDefinitions = await this.definition.find({ where: { id: In(createdDefinitionIds) } })
    const createTranslationOptions = product.languages.flatMap(language => {
      return createdDefinitions.map(definition => {
        return this.translation.create({
          product,
          language,
          definition,
          value: language.isDefault ? definition.defaultValue : undefined,
          isRequireTranslatorAction: language.isDefault ? false : true
        })
      })
    }).reduce((prev, curr) => [...prev, curr], [])

    await this.connection.createQueryBuilder()
      .insert()
      .into(Translation)
      .values(createTranslationOptions)
      .execute()

    await Promise.all(
      product.languages.map(language => {
        return this.language.update(language.id, {
          isRequireTranslatorAction: language.isDefault ? false : true
        })
      })
    )

    this.productSvc.publishTranslations(product.id, 'dev')

    return this.definition.find({ where: { product: product.id } })
  }

  async setPicture(id: string, file: UploadedFileInput) {
    await this.s3Svc.deletePictureForDefinition(id)

    if (!file) {
      return this.definition.update(id, {
        pictureKey: null,
        pictureUrl: null,
      })
    }

    const { Key, Url } = await this.s3Svc.putPictureForDefinition(id, file)

    return this.definition.update(id, {
      pictureKey: Key,
      pictureUrl: Url,
    })
  }

  async deletePitcure(id: string) {
    await this.s3Svc.deletePictureForDefinition(id)
  }
}
