import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PublishEnvironment } from '@kizeo/i18n/util';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadedFileInput } from '../../interfaces/uploaded-file-input.interface';

@Injectable()
export class S3Service {
  s3Client: S3Client
  Bucket: string
  Region: string

  constructor(
    private readonly configSvc: ConfigService,
  ) {
    this.Bucket = this.configSvc.get('AWS_BUCKET_NAME_PUBLIC')
    this.Region = this.configSvc.get('AWS_DEFAULT_REGION')

    this.s3Client = new S3Client({ region: this.Region })

    this.verifyBucketExists()
  }

  getS3Client() {
    return this.s3Client
  }

  private async verifyBucketExists() {
    try {
      const bucketListResult = await this.s3Client.send( new ListBucketsCommand({}) )
      const publishBucket = bucketListResult.Buckets.find(bucket => bucket.Name === this.Bucket)
      if (!publishBucket) {
        console.warn(`${this.Bucket} does not exists`)
      }
    } catch(err) {
      console.warn('Cannot list Buckets')
    }
  }

  async deletePictureForDefinition(id: string) {
    const existingKeys = await this.s3Client.send(
      new ListObjectsCommand({
        Bucket: this.Bucket,
        Prefix: `definition/${id}`
      })
    )

    if (existingKeys.Contents) {
      await Promise.all(
        existingKeys.Contents.map(c => {
          return this.s3Client.send(
            new DeleteObjectCommand({
              Bucket: this.Bucket,
              Key: c.Key
            })
          )
        })
      )
    }

    return {success: true}
  }

  async putPictureForDefinition(id: string, file: UploadedFileInput) {
    const Key = `definition/${id}/${new Date().getTime()}-${file.originalname}`
    const Url = `https://${this.Bucket}.s3.${this.Region}.amazonaws.com/${Key}`

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.Bucket,
        Key,
        ACL: 'public-read',
        Body: file.buffer,
      })
    )

    return {Key, Url}
  }

  async clearPublishedTranslations(id: string, env: PublishEnvironment) {
    const keys = await this.s3Client.send(
      new ListObjectsCommand({
        Bucket: this.configSvc.get('AWS_BUCKET_NAME_PUBLIC'),
        Prefix: `${id}/${env}/`
      })
    )

    if (keys.Contents) {
      await Promise.all(
        keys.Contents.map(content => {
          return this.s3Client.send(
            new DeleteObjectCommand({
              Bucket: this.configSvc.get('AWS_BUCKET_NAME_PUBLIC'),
              Key: content.Key
            })
          )
        })
      )
    }

    return true
  }

  async getSignedURLForTranslation(id: string, env: PublishEnvironment, languageCode: string) {
    const Key = `${id}/${env}/${languageCode}.json`
    return getSignedUrl(
      this.s3Client,
      new GetObjectCommand({Bucket: this.Bucket, Key}),
      {expiresIn: 12 * 3600}
    )
  }
}
