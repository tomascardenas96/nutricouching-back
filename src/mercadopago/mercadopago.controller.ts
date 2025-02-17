import { Body, Controller, Post } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { ProductsInCartDto } from './dto/ProductsInCart.dto';

@Controller('mercadopago')
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Post('preference')
  async createPreference(@Body() productsInCart: ProductsInCartDto[]) {
    return this.mercadopagoService.createPreference(productsInCart);
  }
}
