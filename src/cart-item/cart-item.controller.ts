import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { AddProductsToCartDto } from './dto/AddProductsToCart.dto';
import { AddElementLoggedInDto } from './dto/AddElementLoggedIn.dto';
import { AddSubtractUnityDto } from './dto/AddSubtractUnity.dto';
import { TokenGuard } from 'src/auth/guard/token.guard';

@Controller('cart-item')
@UseGuards(TokenGuard)
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post('add-element/:cartId')
  addOneElementToCart(
    @Param('cartId') cartId: string,
    @Body() elementId: AddElementLoggedInDto,
  ) {
    return this.cartItemService.addOneElementToCart(cartId, elementId);
  }

  @Post('add/:cartId')
  addProductsToCart(
    @Param('cartId') cartId: string,
    @Body() addProductsToCartDto: AddProductsToCartDto,
  ) {
    return this.cartItemService.addProductsToCart(cartId, addProductsToCartDto);
  }

  @Get('get/:cartId')
  getElementsInCartByCartId(@Param('cartId') cartId: string) {
    return this.cartItemService.getElementsInCartByCartId(cartId);
  }

  @Patch('add-subtract/:cartId/:elementId')
  addOrSubtractUnity(
    @Param('cartId') cartId: string,
    @Param('elementId') elementId: string,
    @Body() addSubtractUnityDto: AddSubtractUnityDto,
  ) {
    return this.cartItemService.addSubtractUnity(
      cartId,
      elementId,
      addSubtractUnityDto,
    );
  }

  @Delete(':cartId')
  emptyCart(@Param('cartId') cartId: string) {
    return this.cartItemService.emptyCart(cartId);
  }
}
