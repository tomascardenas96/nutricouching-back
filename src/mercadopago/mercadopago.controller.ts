import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { ProductsInCartDto } from './dto/ProductsInCart.dto';
import { TokenGuard } from 'src/auth/guard/token.guard';
import { ActiveUser } from 'src/common/decorators/Active-user.decorator';
import { User } from 'src/user/entity/user.entity';

@Controller('mercadopago')
@UseGuards(TokenGuard)
export class MercadopagoController {
  constructor(private readonly mercadopagoService: MercadopagoService) {}

  @Post('preference')
  async createPreference(
    @Body() productsInCart: ProductsInCartDto[],
    @ActiveUser() user: User,
  ) {
    return this.mercadopagoService.createPreference(user, productsInCart, null);
  }
}
