import { GetObjectCommand } from '@aws-sdk/client-s3';
import { PublishEnvironment } from '@kizeo/i18n/util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import path = require('path');
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Product)
    private readonly product: Repository<Product>,
    private readonly s3Svc: S3Service,
  ) {}

  async getTranslationsForClients(productId: string, env: PublishEnvironment, languageCode: string) {
    const product = await this.product.findOne(productId)
    if (!product) {
      throw new NotFoundException('Unknown product #', productId)
    }

    const object = await this.s3Svc.s3Client.send(
      new GetObjectCommand({
        Bucket: this.s3Svc.Bucket,
        Key: `${productId}/${env}/${languageCode}.json`
      })
    )

    if (!object) { return {} }

    const streamToString = (stream) => new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });

    return streamToString(object.Body);
  }

  async getLanguagesForClients(productId: string, env: PublishEnvironment) {
    const product = await this.product.findOne(productId)
    if (!product) {
      throw new NotFoundException('Unknown product #', productId)
    }

    const result = await this.s3Svc.listPublishedTranslations(productId, env)
    return result.map(c => path.basename(c.Key).replace('.json', ''))
  }
}
