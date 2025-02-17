import { Body, Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webHookService: WebhookService) {}

  @Post()
  handleWebHook(@Body() webHookData: any) {
    return this.webHookService.handleWebHook(webHookData);
  }
}
