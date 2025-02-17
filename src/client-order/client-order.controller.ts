import { Controller, Post, Param, Body } from '@nestjs/common';
import { ClientOrderService } from './client-order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('client-order')
export class ClientOrderController {
  constructor(private readonly clientOrderService: ClientOrderService) {}

  @Post('create/:cartId')
  async createOrder(
    @Param('cartId') cartId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.clientOrderService.createOrder(cartId, createOrderDto);
  }
}
