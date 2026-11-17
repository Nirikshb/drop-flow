import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: 'dropflow-api',
      version: '0.1.0',
      status: 'ok',
    };
  }
}
