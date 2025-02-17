import { Controller, Post, Param, Body } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';

@Controller('invoice')
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
