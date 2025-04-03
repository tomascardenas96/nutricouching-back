import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TokenGuard } from 'src/auth/guard/token.guard';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webHookService: WebhookService) {}

  @Post()
  handleWebHook(@Body() webHookData: any) {
    return this.webHookService.handleWebHook(webHookData);
  }
}
