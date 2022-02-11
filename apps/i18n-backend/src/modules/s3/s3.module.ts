import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3HealthIndicator } from './s3-health-indicator.service';

@Module({
  providers: [S3Service, S3HealthIndicator],
  exports: [S3Service, S3HealthIndicator],
})
export class S3Module {}
