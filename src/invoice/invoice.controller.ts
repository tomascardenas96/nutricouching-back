import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import { TokenGuard } from 'src/auth/guard/token.guard';

@Controller('invoice')
@UseGuards(TokenGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('generate/:orderId')
  generateInvoice(
    @Param('orderId') orderId: string,
    @Body() generateInvoiceDto: GenerateInvoiceDto[],
  ) {
    return this.invoiceService.generateInvoice(orderId, generateInvoiceDto);
  }
}
