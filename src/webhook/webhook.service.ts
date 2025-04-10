import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartItemService } from 'src/cart-item/cart-item.service';
import { CartService } from 'src/cart/cart.service';
import { ClientOrderService } from 'src/client-order/client-order.service';
import { InvoiceService } from 'src/invoice/invoice.service';
import { NotificationService } from 'src/notification/notification.service';
import { PaymentService } from 'src/payment/payment.service';
import { PlanService } from 'src/plan/plan.service';
import { PlanPurchaseService } from 'src/plan_purchase/plan_purchase.service';
import { ProductService } from 'src/product/product.service';
import { SocketGateway } from 'src/socket/socket.gateway';
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
    private readonly notificationService: NotificationService,
    private readonly socketGateway: SocketGateway,
    private readonly invoiceService: InvoiceService,
    private readonly planService: PlanService,
    private readonly planPurchaseService: PlanPurchaseService,
  ) {}

  async handleWebHook(webHookData: any) {
    try {
      if (webHookData.data) {
        const paymentId = webHookData.data.id;
        const paymentDetails = await this.getPaymentDetails(paymentId);
        const activeCartId = paymentDetails.external_reference;

        const hasPurchase = await this.planService.hasUserPurchasedPlan(
          paymentDetails.metadata.user_id,
          paymentDetails.metadata.plan_id,
        );

        const alreadyProcessed = await this.paymentService.isPaymentProcessed(
          paymentDetails.external_reference,
        );

        if (hasPurchase) return;

        if (paymentDetails.metadata.service_type === 'products') {
          if (alreadyProcessed) return;
        }

        /**
         * Al ser aceptado el pago:
         * - Vaciar el carrito de compras. ✅
         * - Enviar notificacion flotante al usuario. ✅
         * - Restar stock de los productos. ✅
         * - Inhabilitar el carrito activo. ✅
         * - Crear un carrito activo nuevo. ✅
         * - Cambiar el estado de la orden a CONFIRMED. ✅
         * - Generar la factura. ✅
         *
         * Al ser rechazado el pago:
         * - Enviar notificacion flotante al usuario con el pago rechazado. ✅
         *
         * Sea rechazado o aceptado:
         * - Enviar notificacion al usuario. ✅
         * - Marcar el pago como rechazado/aceptado para que no se repita la operacion. ✅
         */

        if (paymentDetails.status === 'approved') {
          // Si es un plan, no se hace nada con el carrito, ya que no se generan ordenes.
          if (!!paymentDetails.metadata.plan_id) {
            // 1. Vamos a marcar el plan como pagado.
            await this.planPurchaseService.processPlanPayment(
              paymentDetails.metadata.user_id,
              paymentDetails.metadata.plan_id,
              'approved',
            );

            // Creamos un pago en DB para guardar el registro
            return await this.paymentService.markPaymentAsProcessed({
              paymentId: paymentDetails.metadata.plan_id,
              clientOrder: null,
            });
          }

          const itemsAndQuantity = paymentDetails.additional_info.items.map(
            (item: any) => {
              return {
                id: item.id,
                quantity: item.quantity,
              };
            },
          );

          // Restamos stock de los elementos comprados (viandas/productos).
          await this.productService.subtractStockAfterPurchase(
            itemsAndQuantity,
          );
          await this.viandService.subtractStockAfterPurchase(itemsAndQuantity);

          // Obtenemos la orden.
          const clientOrder =
            await this.clientOrderService.getPendingClientOrderByCart(
              activeCartId,
            );

          // Generamos la factura
          const itemsForInvoice = paymentDetails.additional_info.items.map(
            (item: any) => {
              return {
                id: item.id,
                quantity: item.quantity,
                price: item.unit_price,
                name: item.title,
              };
            },
          );

          await this.invoiceService.generateInvoice(
            clientOrder.clientOrderId,
            itemsForInvoice,
          );

          // Guardamos el pago en la DB (para que no se ejecute la operacion varias veces).
          await this.paymentService.markPaymentAsProcessed({
            paymentId: paymentDetails.external_reference,
            clientOrder,
          });

          // Marcamos la orden como confirmada.
          await this.clientOrderService.markOrderAsConfirmed(clientOrder);

          // Vaciamos el carrito.
          await this.cartItemService.emptyCart(activeCartId);

          // Creamos un nuevo carrito para el usuario activo y lo enviamos por websockets.
          const cart = await this.cartService.getCartById(activeCartId);
          const newCart = await this.cartService.createCart(cart.user);

          this.socketGateway.sendNewCart(cart.user.userId, newCart);

          // Deshabilitamos el carrito.
          await this.cartService.disableCart(activeCartId);

          // Creamos una notificacion y la enviamos al usuario en tiempo real.
          const notification =
            await this.notificationService.createNotification(
              cart.user.userId,
              'Tu compra ha sido exitosa!',
            );

          this.socketGateway.notifyUserAfterPurchase(
            cart.user.userId,
            notification,
          );
        } else if (paymentDetails.status === 'rejected') {
          // Creamos una notificacion y la enviamos al usuario en tiempo real.
          const cart = await this.cartService.getCartById(activeCartId);

          const notification =
            await this.notificationService.createNotification(
              cart.user.userId,
              'Tu compra ha sido rechazada, intente nuevamente',
            );

          this.socketGateway.notifyUserAfterPurchase(
            cart.user.userId,
            notification,
          );
        } else {
          const cart = await this.cartService.getCartById(activeCartId);

          const notification =
            await this.notificationService.createNotification(
              cart.user.userId,
              'Tu pago está en proceso, te notificaremos cuando se confirme.',
            );

          this.socketGateway.notifyUserAfterPurchase(
            cart.user.userId,
            notification,
          );
        }
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadGatewayException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
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

  private;
}
