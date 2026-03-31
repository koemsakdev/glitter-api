import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

interface DbNowResult {
  now: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-test')
  async testDb(): Promise<{
    message: string;
    result: DbNowResult[];
  }> {
    const result: DbNowResult[] = await this.dataSource.query('SELECT NOW()');

    return {
      message: 'DB connected successfully',
      result,
    };
  }
}
