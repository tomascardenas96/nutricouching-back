import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import { ClientOrderService } from 'src/client-order/client-order.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly clientOrderService: ClientOrderService,
  ) {}

  async generateInvoice(
    orderId: string,
    generateInvoiceDto: GenerateInvoiceDto[],
  ) {
    try {
      const clientOrder =
        await this.clientOrderService.getClientOrderById(orderId);

      const invoice = [];

      for (const item of generateInvoiceDto) {
        const newInvoice = this.invoiceRepository.create({
          order: clientOrder,
          itemId: item.itemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        });

        invoice.push(newInvoice);
      }

      return this.invoiceRepository.save(invoice);
    } catch (error) {
      throw new BadGatewayException('Error generating invoice');
    }
  }
}
