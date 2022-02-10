import { Controller, Get } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { S3HealthIndicator } from './s3/s3-health-indicator.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private s3: S3HealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory heap', 300 * 1024 * 1024),
      () => this.memory.checkRSS('memory RSS', 300 * 1024 * 1024),
      () => this.disk.checkStorage('local storage', { path: '/', thresholdPercent: 0.5 }),
      () => this.s3.isHealthy('s3'),
    ]);
  }
}
