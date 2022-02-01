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
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import path = require('path');

@Injectable()
export class ProductService {
  s3Client: S3Client
  isPublishBucketAvailable = true

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
  ) {
    this.initS3()
  }

  async initS3() {
    this.s3Client = new S3Client({
      region: this.configSvc.get('AWS_DEFAULT_REGION')
    })

    try {
      const bucketListResult = await this.s3Client.send( new ListBucketsCommand({}) )
      const publishBucket = bucketListResult.Buckets.find(bucket => bucket.Name === this.configSvc.get('AWS_BUCKET_NAME_PUBLISH'))
      if (!publishBucket) {
        this.isPublishBucketAvailable = false
        console.warn(`${this.configSvc.get('AWS_BUCKET_NAME_PUBLISH')} does not exists`)
      }
    } catch(err) {
      this.isPublishBucketAvailable = false
      console.warn('Cannot list Buckets')
    }
  }

  async create(createProductDto: CreateProductDto, jwtPayload: any) {
    const createOptions = this.product.create({
      defaultLanguage: createProductDto.defaultLanguage.code,
      name: createProductDto.name
    })
    const product = await this.product.save(createOptions);

    await this.addMember(product.id, {
      memberId: jwtPayload?.sub || 'missing-jwt',
      memberEmail: jwtPayload.email || 'missing-jwt@example.com',
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

  async publishTranslations(id: string, env: string) {
    const product = await this.product.findOne(id)
    if (!product) {
      throw new NotFoundException('Unknown product ID')
    }

    if (!['dev', 'preprod', 'prod'].includes(env)) {
      throw new NotFoundException('Unknown environment')
    }

    await this.clearPublishedTranslations(product.id, env as 'dev' | 'preprod' | 'prod')

    if (env === 'dev' || env === 'preprod') {
      const languages = await this.language.find({
        where : { isDisabled: false, product: id },
        relations: ['translations', 'translations.definition']
      })

      const promises = languages.map(language => {
        const fileContent = language.translations.reduce(
          (prev, t) => ({...prev, [t.definition!.slug]: t.value}), {}
        )

        if (!this.isPublishBucketAvailable) {
          return Promise.reject(`${this.configSvc.get('AWS_BUCKET_NAME_PUBLISH')} does not exists`)
        }

        return this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.configSvc.get('AWS_BUCKET_NAME_PUBLISH'),
            Key: `${product.id}/${env}/${language.code}.json`,
            Body: JSON.stringify(fileContent),
            ACL: 'public-read',
            Metadata: { filename: `${language.code}.json` }
          })
        )
      })
      await Promise.all(promises)

      if (env === 'preprod') {
        await this.product.update(product.id, { publishedPreprodAt: new Date() })
      }
    }

    if (env === 'prod') {
      if (!this.isPublishBucketAvailable) {
        return Promise.reject(`${this.configSvc.get('AWS_BUCKET_NAME_PUBLISH')} does not exists`)
      }

      const keys = await this.s3Client.send(
        new ListObjectsCommand({
          Bucket: this.configSvc.get('AWS_BUCKET_NAME_PUBLISH'),
          Prefix: `${id}/preprod/`,
        })
      )

      if (keys.Contents) {
        await Promise.all(
          keys.Contents.map(async content => {
            return this.s3Client.send(
              new CopyObjectCommand({
                Bucket: this.configSvc.get('AWS_BUCKET_NAME_PUBLISH'),
                ACL: 'public-read',
                CopySource: `${this.configSvc.get('AWS_BUCKET_NAME_PUBLISH')}/${content.Key}`,
                Key: `${id}/prod/${path.basename(content.Key)}`
              })
            )
          })
        )
      }

      await this.product.update(product.id, { publishedProdAt: new Date() })
    }
    return { success: true }
  }

  private async clearPublishedTranslations(id: string, env: 'dev' | 'preprod' | 'prod') {
    if (!this.isPublishBucketAvailable) {
      return Promise.reject(`${this.configSvc.get('AWS_BUCKET_NAME_PUBLISH')} does not exists`)
    }

    const keys = await this.s3Client.send(
      new ListObjectsCommand({
        Bucket: this.configSvc.get('AWS_BUCKET_NAME_PUBLISH'),
        Prefix: `${id}/${env}/`
      })
    )

    if (keys.Contents) {
      await Promise.all(
        keys.Contents.map(content => {
          return this.s3Client.send(
            new DeleteObjectCommand({
              Bucket: this.configSvc.get('AWS_BUCKET_NAME_PUBLISH'),
              Key: content.Key
            })
          )
        })
      )
    }

    return true
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

}
