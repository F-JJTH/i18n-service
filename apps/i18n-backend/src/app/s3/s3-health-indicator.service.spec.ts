import { Test, TestingModule } from '@nestjs/testing';
import { S3HealthIndicatorService } from './s3-health-indicator.service';

describe('S3HealthIndicatorService', () => {
  let service: S3HealthIndicatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3HealthIndicatorService],
    }).compile();

    service = module.get<S3HealthIndicatorService>(S3HealthIndicatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
