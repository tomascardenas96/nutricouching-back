import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { ProductsInCartDto } from './dto/ProductsInCart.dto';
import {
  BadGatewayException,
  BadRequestException,
} from '@nestjs/common/exceptions';
import { Plan } from 'src/plan/entities/plan.entity';

@Injectable()
export class MercadopagoService {
  private client: MercadoPagoConfig;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.ACCESS_TOKEN_MP,
    });
  }

  async createPreference(productsInCart?: ProductsInCartDto[], plan?: Plan) {
    try {
      const preference = new Preference(this.client);
      // Si vienen productos desde un carrito se implementa una logica, si viene un plan se implementa otra.
      let items: any;

      if (!!productsInCart) {
        items = productsInCart.map((item) => ({
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
      } else if (!!plan) {
        items = [
          {
            id: plan.planId,
            category_id: 'plan',
            title: plan.title,
            quantity: 1,
            unit_price: plan.price,
            currency_id: 'ARS',
            description: plan.description,
          },
        ];
      }

      const preferenceData = {
        body: {
          items,
          back_urls: {
            success: `${process.env.SERVER_HOST}/home/success`,
            failure: `${process.env.SERVER_HOST}/home/failure`,
            pending: `${process.env.SERVER_HOST}/home/pending`,
          },
          notification_url: `${process.env.WEB_HOOK_MP}/webhook`,
          external_reference: plan?.planId || productsInCart[0]?.cart?.cartId,
        },
      };

      return await preference.create(preferenceData);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadGatewayException(
        'Payments service: error creating the preference - createPreference method',
      );
    }
  }
}
