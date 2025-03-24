import {
  Injectable,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
  ) {}

  /**
   * Metodo para crear un nuevo carrito asociado a un usuario
   *
   * @param user - Usuario vinculado con el carrito
   * @returns - Carrito creado
   */
  async createCart(user: User): Promise<Cart> {
    try {
      const cart = this.cartRepository.create({ user });

      return await this.cartRepository.save(cart);
    } catch (error) {
      throw new BadGatewayException('Error creating cart', error.message);
    }
  }

  /**
   * Obtiene un carrito por su id
   *
   * @param cartId - ID del carrito a obtener
   * @returns - Carrito obtenido por el ID.
   */
  async getCartById(cartId: string): Promise<Cart> {
    try {
      const cart: Cart = await this.cartRepository.findOne({
        where: { cartId, isActive: true },
      });

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      return cart;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadGatewayException('Error getting cart by id');
    }
  }

  async getActiveCart(userId: string) {
    try {
      return this.cartRepository.findOne({
        where: { user: { userId }, isActive: true },
      });
    } catch (error) {
      throw new BadGatewayException('Error getting active cart');
    }
  }

  async disableCart(cartId: string): Promise<void> {
    try {
      const cart = await this.getCartById(cartId);
      cart.isActive = false;

      await this.cartRepository.save(cart);
    } catch (error) {
      throw new BadGatewayException('Error disabling cart');
    }
  }
}
