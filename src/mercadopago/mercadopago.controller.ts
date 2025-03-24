import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { ProductsInCartDto } from './dto/ProductsInCart.dto';
import { TokenGuard } from 'src/auth/guard/token.guard';

@Controller('mercadopago')
@UseGuards(TokenGuard)
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Post('preference')
  async createPreference(@Body() productsInCart: ProductsInCartDto[]) {
    return this.mercadopagoService.createPreference(productsInCart);
  }
}
