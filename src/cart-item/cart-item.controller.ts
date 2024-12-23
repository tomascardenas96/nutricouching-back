import { Body, Controller, Param, Post } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { AddProductsToCartDto } from './dto/AddProductsToCart.dto';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post('add/:cartId')
  addProductsToCart(
    @Param('cartId') cartId: string,
    @Body() addProductsToCartDto: AddProductsToCartDto,
  ) {
    return this.cartItemService.addProductsToCart(cartId, addProductsToCartDto);
  }
}
