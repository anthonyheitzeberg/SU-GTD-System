import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Message } from '@su-gtd/api-interfaces';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  getHello(): Message {
    return this.appService.getData();
  }
}
