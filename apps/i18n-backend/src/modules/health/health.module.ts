import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { S3Module } from '../s3/s3.module';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, S3Module],
  controllers: [HealthController]
})
export class HealthModule {}
