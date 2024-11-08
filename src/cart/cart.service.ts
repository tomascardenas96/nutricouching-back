import { Injectable, BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';

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

//   async getCartById(cartId: string) {
//     try {
//       return this.cartRepository.findOne({ where: { cartId } });
//     } catch (error) {
//       throw new BadGatewayException('Error getting cart by id');
//     }
//   }
}
