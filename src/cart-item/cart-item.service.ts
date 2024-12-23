import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/Cart-item.entity';
import { Repository } from 'typeorm';
import { AddProductsToCartDto } from './dto/AddProductsToCart.dto';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';
import { CartService } from 'src/cart/cart.service';
import { Cart } from 'src/cart/entities/cart.entity';
import { ViandService } from 'src/viand/viand.service';
import { Viand } from 'src/viand/entities/viand.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly viandService: ViandService,
  ) {}

  async addProductsToCart(
    cartId: string,
    { products, viands }: AddProductsToCartDto,
  ) {
    try {
      if (!products && !viands) {
        throw new BadRequestException('At least an item is required');
      }

      // Obtenemos el carrito del usuario
      const cart: Cart = await this.cartService.getCartById(cartId);

      let productsToAddList = [];

      if (products?.length > 0) {
        for (const product of products) {
          const p: Product = await this.productService.getProductById(
            product.productId,
          );
          productsToAddList.push({
            product: p,
            quantity: product.quantity,
            cart,
          });
        }
      }

      if (viands?.length > 0) {
        for (const viand of viands) {
          const v: Viand = await this.viandService.getViandById(viand.viandId);
          productsToAddList.push({
            viand: v,
            quantity: viand.quantity,
            cart,
          });
        }
      }

      return await this.cartItemRepository.save(productsToAddList);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof BadGatewayException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error adding products to cart');
    }
  }
}
