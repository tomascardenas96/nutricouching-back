import { Injectable, BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientOrder } from './entities/client-order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from 'src/cart/cart.service';
import { OrderStatus } from './enum/order-status.enum';

@Injectable()
export class ClientOrderService {
  constructor(
    @InjectRepository(ClientOrder)
    private readonly clientOrderRepository: Repository<ClientOrder>,
    private readonly cartService: CartService,
  ) {}

  /**
   * Crea una nueva orden
   *
   * @param cartId - ID del carrito activo
   * @param total - Monto total de la compra
   * @returns - Objeto completo de la orden creada
   */
  async createOrder(cartId: string, { total }: CreateOrderDto) {
    try {
      // Si ya existe una orden pendiente, solo le modificamos el monto total.
      const pendingOrder = await this.getPendingClientOrderByCart(cartId);

      if (!!pendingOrder) {
        pendingOrder.total = total;

        return await this.clientOrderRepository.save(pendingOrder);
      }

      const cart = await this.cartService.getCartById(cartId);
      const newOrder = this.clientOrderRepository.create({ cart, total });

      return await this.clientOrderRepository.save(newOrder);
    } catch (error) {
      throw new BadGatewayException('Error creating order');
    }
  }

  async getPendingClientOrderByCart(cartId: string) {
    try {
      return await this.clientOrderRepository.findOne({
        where: { cart: { cartId }, status: OrderStatus.PENDING },
      });
    } catch (error) {
      throw new BadGatewayException(
        'Error getting pending client order by cart',
      );
    }
  }

  async markOrderAsConfirmed(clientOrder: ClientOrder) {
    try {
      clientOrder.status = OrderStatus.CONFIRMED;

      return this.clientOrderRepository.save(clientOrder);
    } catch (error) {
      throw new BadGatewayException('Error marking order as confirmed');
    }
  }

  /**
   * Devuelve un cliente por su ID
   *
   * @param clientOrderId - ID de la orden
   * @returns - Objeto de tipo ClientOrder
   */
  async getClientOrderById(clientOrderId: string) {
    try {
      return this.clientOrderRepository.findOne({ where: { clientOrderId } });
    } catch (error) {
      throw new BadGatewayException('Error getting client order by id');
    }
  }
}
