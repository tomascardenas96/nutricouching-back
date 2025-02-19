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

  /**
   * Genera una factura tomando un snapshot de la informacion de los elementos comprados.
   *
   * @param orderId - ID de la orden
   * @param generateInvoiceDto - Informacion de los productos.
   * @returns - Factura generada
   */
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
          itemId: item.id,
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
