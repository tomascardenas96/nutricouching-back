import { Injectable, BadGatewayException } from '@nestjs/common';
import { CartItemService } from 'src/cart-item/cart-item.service';
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
  ) {}

  async handleWebHook(webHookData: any) {
    try {
      if (webHookData.data) {
        const paymentId = webHookData.data.id;
        const paymentDetails = await this.getPaymentDetails(paymentId);
        const activeCartId = paymentDetails.external_reference;

        const alreadyProcessed =
          await this.paymentService.isPaymentProcessed(paymentId);

        if (alreadyProcessed) {
          return;
        }

        /**
         * Al ser aceptado el pago:
         * - Vaciar el carrito de compras. ✅
         * - Enviar notificacion flotante al usuario.
         * - Restar stock de los productos. ✅
         * - Inhabilitamos el carrito activo.
         * - Crear un carrito activo nuevo.
         * - Cambiar el estado de la orden a CONFIRMED.
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
          
          await this.productService.subtractStockAfterPurchase(items);
          await this.viandService.subtractStockAfterPurchase(items);
          console.log("alreadyProcessed");
          await this.cartItemService.emptyCart(activeCartId);

          const clientOrder =
            await this.clientOrderService.getPendingClientOrderByCart(
              activeCartId,
            );

          console.log(clientOrder);

          await this.paymentService.markPaymentAsProcessed({
            paymentId: paymentDetails.id,
            clientOrder,
          });
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
