import { Controller, Get, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('active/:userId')
  async getActiveCart(@Param('userId') userId: string) {
    return this.cartService.getActiveCart(userId);
  }
}
