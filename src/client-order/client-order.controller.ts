import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ClientOrderService } from './client-order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TokenGuard } from 'src/auth/guard/token.guard';

@Controller('client-order')
@UseGuards(TokenGuard)
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
