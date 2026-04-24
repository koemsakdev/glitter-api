import { Injectable } from '@nestjs/common';

// Defining an interface for type safety
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

@Injectable()
export class AppService {
  getHealth(): HealthCheckResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(), // Returns the node process uptime in seconds
    };
  }
}
