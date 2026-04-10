import { Controller, Get } from '@nestjs/common';
import * as appService_1 from './app.service';
import { DataSource } from 'typeorm';

// interface DbNowResult {
//   now: string;
// }

@Controller()
export class AppController {
  constructor(
    private readonly appService: appService_1.AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('health-check')
  checkHealth(): appService_1.HealthCheckResponse {
    return this.appService.getHealth();
  }
}
