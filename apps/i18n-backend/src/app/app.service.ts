import { GetObjectCommand, ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import path = require('path');
import { Repository } from 'typeorm';
import { Product } from './product/entities/product.entity';

@Injectable()
export class AppService {
  s3Client: S3Client
  cognitoClient: CognitoIdentityProviderClient

  constructor(
    @InjectRepository(Product)
    private readonly product: Repository<Product>,
    private readonly configSvc: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configSvc.get('AWS_DEFAULT_REGION')
    })

    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configSvc.get('AWS_DEFAULT_REGION'),
    })
  }

  getHealthCheck(): { message: string } {
    return { message: 'Welcome to i18n-backend!' };
  }

  async getTranslationsForClients(productId: string, env: string, languageCode: string) {
    const product = await this.product.findOne(productId)
    if (!product) {
      throw new NotFoundException('Unknow product #', productId)
    }

    const object = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.configSvc.get('AWS_BUCKET_NAME_PUBLIC'),
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

  async getLanguagesForClients(productId: string, env: string) {
    const product = await this.product.findOne(productId)
    if (!product) {
      throw new NotFoundException('Unknow product #', productId)
    }

    const { Contents } = await this.s3Client.send(
      new ListObjectsCommand({
        Bucket: this.configSvc.get('AWS_BUCKET_NAME_PUBLIC'),
        Prefix: `${productId}/${env}/`
      })
    )

    if (!Contents) { return [] }

    return Contents.map(c => path.basename(c.Key).replace('.json', ''))
  }

  async listUsers() {
    const response = await this.cognitoClient.send(
      new ListUsersCommand({
        UserPoolId: this.configSvc.get('AWS_COGNITO_USER_POOL_ID'),
      })
    )

    return response.Users
  }
}
