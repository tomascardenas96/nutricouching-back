import {
  Injectable,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
  ) {}

  async createCart(): Promise<Cart> {
    try {
      const cart: Cart = new Cart();

      return await this.cartRepository.save(cart);
    } catch (error) {
      throw new BadGatewayException('Error creating cart');
    }
  }

  async getCartById(cartId: string): Promise<Cart> {
    try {
      const cart: Cart = await this.cartRepository.findOne({
        where: { cartId },
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
}
