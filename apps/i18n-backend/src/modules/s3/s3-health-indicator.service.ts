import { DeleteObjectCommand, ListBucketsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { S3Service } from './s3.service';

@Injectable()
export class S3HealthIndicator extends HealthIndicator {
  s3Client: S3Client

  constructor(
    private s3Svc: S3Service,
  ) {
    super()
    this.s3Client = this.s3Svc.getS3Client()
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const detail = {write: false, delete: false, exists: false}

      const bucketListResult = await this.s3Client.send( new ListBucketsCommand({}) )
      const publishBucket = bucketListResult.Buckets.find(bucket => bucket.Name === this.s3Svc.Bucket)
      if (publishBucket) {
        detail.exists = true
      }

      const Key = `health/check-${new Date().getTime()}`
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.s3Svc.Bucket,
          Key,
          ACL: 'public-read',
          Body: Key,
        })
      )
      detail.write = true

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.s3Svc.Bucket,
          Key,
        })
      )
      detail.delete = true

      return this.getStatus(key, true, detail)
    } catch(e) {
      throw new HealthCheckError('S3 health check failed', this.getStatus(key, false, e))
    }
  }
}
