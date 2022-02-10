import { Test, TestingModule } from '@nestjs/testing';
import { S3HealthIndicator } from './s3-health-indicator.service';

describe('S3HealthIndicator', () => {
  let service: S3HealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3HealthIndicator],
    }).compile();

    service = module.get<S3HealthIndicator>(S3HealthIndicator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
