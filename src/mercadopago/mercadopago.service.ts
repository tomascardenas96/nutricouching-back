import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { ProductsInCartDto } from './dto/ProductsInCart.dto';
import {
  BadGatewayException,
  BadRequestException,
} from '@nestjs/common/exceptions';

@Injectable()
export class MercadopagoService {
  private client: MercadoPagoConfig;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.ACCESS_TOKEN_MP,
    });
  }

  async createPreference(productsInCart: ProductsInCartDto[]) {
    try {
      const preference = new Preference(this.client);

      const items = productsInCart.map((item) => ({
        id: item.product?.productId || item.viand?.viandId,
        category_id: 'food',
        title: item.product?.name || item.viand?.name,
        quantity: item.quantity,
        unit_price: item.product?.price || item.viand?.price,
        currency_id: 'ARS',
        picture_url:
          `${process.env.WEB_HOOK_MP}/${item.product?.image}` ||
          `${process.env.WEB_HOOK_MP}/${item.viand?.image}`,
        description: item.product?.description || item.viand?.description,
      }));

      const preferenceData = {
        body: {
          items,
          back_urls: {
            success: 'http://localhost:3010/home/success',
            failure: 'http://localhost:3010/home/failure',
            pending: 'http://localhost:3010/home/pending',
          },
          notification_url: `${process.env.WEB_HOOK_MP}/webhook`,
          external_reference: productsInCart[0].cart.cartId,
        },
      };

      return await preference.create(preferenceData);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadGatewayException(
        'Payments service: error creating the preference - createPreference method',
      );
    }
  }
}
