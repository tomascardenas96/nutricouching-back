import { Controller } from '@nestjs/common';
import { ClientOrderService } from './client-order.service';

@Controller('client-order')
export class ClientOrderController {
  constructor(private readonly clientOrderService: ClientOrderService) {}
}
