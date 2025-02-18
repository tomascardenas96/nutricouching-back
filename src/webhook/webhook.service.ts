import { Injectable, BadGatewayException } from '@nestjs/common';
import { CartItemService } from 'src/cart-item/cart-item.service';
import { CartService } from 'src/cart/cart.service';
import { ClientOrderService } from 'src/client-order/client-order.service';
import { PaymentService } from 'src/payment/payment.service';
import { ProductService } from 'src/product/product.service';
import { ViandService } from 'src/viand/viand.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
    private readonly viandService: ViandService,
    private readonly paymentService: PaymentService,
    private readonly clientOrderService: ClientOrderService,
    private readonly cartService: CartService,
  ) {}

  async handleWebHook(webHookData: any) {
    try {
      if (webHookData.data) {
        const paymentId = webHookData.data.id;
        const paymentDetails = await this.getPaymentDetails(paymentId);
        const activeCartId = paymentDetails.external_reference;

        const alreadyProcessed = await this.paymentService.isPaymentProcessed(
          paymentDetails.external_reference,
        );

        if (alreadyProcessed) {
          return;
        }

        /**
         * Al ser aceptado el pago:
         * - Vaciar el carrito de compras. ✅
         * - Enviar notificacion flotante al usuario.
         * - Restar stock de los productos. ✅
         * - Inhabilitar el carrito activo. ✅
         * - Crear un carrito activo nuevo. ✅
         * - Cambiar el estado de la orden a CONFIRMED. ✅
         *
         * Al ser rechazado el pago:
         * - Enviar notificacion flotante al usuario con el pago rechazado.
         *
         * Sea rechazado o aceptado:
         * - Enviar notificacion al usuario.
         * - Marcar el pago como rechazado/aceptado para que no se repita la operacion.
         */

        if (paymentDetails.status === 'approved') {
          const items = paymentDetails.additional_info.items.map((item) => {
            return {
              id: item.id,
              quantity: item.quantity,
            };
          });

          // await this.productService.subtractStockAfterPurchase(items);
          // await this.viandService.subtractStockAfterPurchase(items);

          // Obtenemos la orden
          const clientOrder =
            await this.clientOrderService.getPendingClientOrderByCart(
              activeCartId,
            );

          // Guardamos el pago en la DB (para que no se ejecute la operacion varias veces)
          await this.paymentService.markPaymentAsProcessed({
            paymentId: paymentDetails.external_reference,
            clientOrder,
          });

          // Marcamos la orden como confirmada.
          await this.clientOrderService.markOrderAsConfirmed(clientOrder);

          // Vaciamos el carrito
          await this.cartItemService.emptyCart(activeCartId);

          // Creamos un nuevo carrito para el usuario activo
          const cart = await this.cartService.getCartById(activeCartId);
          await this.cartService.createCart(cart.user);

          // Deshabilitamos el carrito.
          await this.cartService.disableCart(activeCartId);
        } else if (paymentDetails.status === 'rejected') {
          console.log('rechazado');
        }
      }
    } catch (error) {
      throw new BadGatewayException('Error handling web hook');
    }
  }

  /**
   * Metodo necesario para obtener los detalles del pago realizado
   *
   * @param paymentId
   * @returns
   */
  private async getPaymentDetails(paymentId: string) {
    try {
      const accessToken = process.env.ACCESS_TOKEN_MP;

      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      return await response.json();
    } catch (error) {
      throw new BadGatewayException('Error getting payment details');
    }
  }
}
