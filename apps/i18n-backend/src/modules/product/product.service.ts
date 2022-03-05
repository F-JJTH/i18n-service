import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Language } from '../language/entities/language.entity';
import { Translation } from '../translation/entities/translation.entity';
import { MemberAuthorization } from './entities/member-authorization.entity';
import { Product } from './entities/product.entity';
import { CopyObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import path = require('path');
import { S3Service } from '../s3/s3.service';
import { PublishEnvironment } from '@kizeo/i18n/util';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly product: Repository<Product>,
    @InjectRepository(MemberAuthorization)
    private readonly memberAuthorization: Repository<MemberAuthorization>,
    @InjectRepository(Language)
    private readonly language: Repository<Language>,
    @InjectRepository(Translation)
    private readonly translation: Repository<Translation>,
    private readonly configSvc: ConfigService,
    private readonly s3Svc: S3Service,
  ) {}

  async create(createProductDto: CreateProductDto, jwtPayload: any) {
    const createOptions = this.product.create({
      defaultLanguage: createProductDto.defaultLanguage.code,
      name: createProductDto.name
    })
    const product = await this.product.save(createOptions);

    await this.addMember(product.id, {
      memberId: jwtPayload?.sub || 'missing-jwt',
      memberEmail: jwtPayload?.email || 'missing-jwt@example.com',
      authorizations: {
        definitions: true,
        deploy: true,
        settings: true,
        translations: ['ALL'],
        validator: true,
      }
    })

    const language = this.language.create({
      product,
      code: createProductDto.defaultLanguage.code,
      name: createProductDto.defaultLanguage.label,
      isDefault: true,
      isDisabled: false,
      isRequireTranslatorAction: false,
    })
    await this.language.save(language)

    return this.findOne(product.id)
  }

  findAll() {
    return this.product.find();
  }

  async findAllForMember(jwtPayload: any) {
    if (!jwtPayload) {
      jwtPayload = { sub: 'missing-jwt' }
    }

    if (jwtPayload['cognito:groups'] && jwtPayload['cognito:groups'].includes('Admin')) {
      return this.product.find()
    }
    
    const result = await this.product.createQueryBuilder('product')
      .select('id')
      .where('product.members && ARRAY[:...members]', {members: [jwtPayload.sub]})
      .execute()
    const productIds = result.map(r => r.id)

    return this.product.find({
      where: { id: In(productIds) }
    })
  }

  async findOne(id: string) {
    const product = await this.product.findOne(id, {relations: ['authorizations']})
    if (!product) {
      throw new NotFoundException()
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.product.findOne(id)
    if (!product) {
      throw new NotFoundException()
    }

    await this.product.save({
      ...product,
      name: updateProductDto.name,
      defaultLanguage: updateProductDto.defaultLanguage?.code || product.defaultLanguage
    })
    return this.product.findOne(id);
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    if (!product) {
      throw new NotFoundException()
    }
    return this.product.softRemove(product);
  }

  async addMember(id: string, member: AddMemberDto) {
    const product = await this.product.findOne(id)
    if (!product) {
      throw new NotFoundException()
    }

    if (product.members.includes(member.memberId)) {
      return this.findOne(id)
    }

    const members = [
      ...product.members,
      member.memberId
    ]

    await this.product.save({...product, members})

    const createOptions = this.memberAuthorization.create({
      memberId: member.memberId,
      email: member.memberEmail,
      definitions: member.authorizations.definitions,
      deploy: member.authorizations.deploy,
      translations: member.authorizations.translations,
      validator: member.authorizations.validator,
      settings: member.authorizations.settings,
      product
    })
    await this.memberAuthorization.save(createOptions)

    return this.findOne(id);
  }

  async updateMember(id: string, memberId: string, updateMemberDto: UpdateMemberDto) {
    const member = await this.memberAuthorization.findOne({
      where: {
        product: id,
        memberId: memberId,
      }
    })

    if (!member) {
      throw new NotFoundException()
    }

    await this.memberAuthorization.save({
      ...member,
      definitions: updateMemberDto.authorizations.definitions,
      settings: updateMemberDto.authorizations.settings,
      deploy: updateMemberDto.authorizations.deploy,
      validator: updateMemberDto.authorizations.validator,
      translations: updateMemberDto.authorizations.translations,
    })

    return this.findOne(id);
  }

  async removeMember(id: string, memberId: string) {
    const product = await this.findOne(id)
    if (!product) {
      throw new NotFoundException()
    }

    const members = product.members.filter(m => m !== memberId)
    await this.product.save({...product, members})

    const authorization = product.authorizations.filter(a => a.memberId === memberId)
    if (authorization) {
      await this.memberAuthorization.remove(authorization)
    }

    return this.findOne(id);
  }

  async publishTranslations(id: string, env: PublishEnvironment) {
    const product = await this.product.findOne(id)
    if (!product) {
      throw new NotFoundException('Unknown product #', id)
    }

    if (!['dev', 'preprod', 'prod'].includes(env)) {
      throw new NotFoundException('Unknown environment', env)
    }

    await this.s3Svc.clearPublishedTranslations(product.id, env)

    if (env === 'dev' || env === 'preprod') {
      const languages = await this.language.find({
        where : { isDisabled: false, product: id },
        relations: ['translations', 'translations.definition']
      })

      const promises = languages.map(language => {
        const fileContent = language.translations.reduce(
          (prev, t) => ({...prev, [t.definition.slug]: t.value}), {}
        )

        return this.s3Svc.uploadTranslation(product.id, env, language.code, fileContent)
      })
      await Promise.all(promises)

      const availableLanguagesFileContent = languages.sort(l => l.isDefault ? -1 : 1).map(l => l.code)
      await this.s3Svc.uploadAvailableLanguageList(product.id, env, availableLanguagesFileContent)

      if (env === 'preprod') {
        await this.product.update(product.id, { publishedPreprodAt: new Date() })
      }
    }

    if (env === 'prod') {
      const list = await this.s3Svc.listPublishedTranslations(id, 'preprod')

      if (list && list.length) {
        await Promise.all(
          list.map(async content => {
            return this.s3Svc.s3Client.send(
              new CopyObjectCommand({
                Bucket: this.s3Svc.Bucket,
                ACL: 'public-read',
                CopySource: `${this.s3Svc.Bucket}/${content.Key}`,
                Key: `${id}/prod/${path.basename(content.Key)}`,
                CacheControl: 'max-age=43200',
                ContentType: 'application/json',
              })
            )
          })
        )
      }

      await this.product.update(product.id, { publishedProdAt: new Date() })
    }
    return { success: true }
  }

  async getLanguage(id: string) {
    const product = await this.product.findOne(id, {relations: ['languages']})
    if (!product) {
      throw new NotFoundException()
    }

    return product.languages;
  }

  async getDefinition(id: string) {
    const product = await this.product.findOne(id, {relations: ['definitions']})
    if (!product) {
      throw new NotFoundException()
    }

    return product.definitions;
  }

  async getTranslation(id: string) {
    return this.translation.find({
      relations: ['definition', 'language'],
      where: {
        product: id
      }
    })
  }

  async getDownloadLinkForTranslation(id: string, env: PublishEnvironment, languageCode: string) {
    return this.s3Svc.getSignedURLForTranslation(id, env, languageCode)
  }

  async listPublishedTranslations(id: string, env: PublishEnvironment) {
    const result = await this.s3Svc.listPublishedTranslations(id, env)
    return result.map(item => ({
      Key: item.Key,
      Filename: path.basename(item.Key),
      LanguageCode: path.basename(item.Key).replace('.json', '')
    }))
  }
}
