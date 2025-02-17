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
import { AddElementLoggedInDto } from './dto/AddElementLoggedIn.dto';
import { AddSubtractUnityDto } from './dto/AddSubtractUnity.dto';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly viandService: ViandService,
  ) {}

  async addOneElementToCart(
    cartId: string,
    { productId, viandId }: AddElementLoggedInDto,
  ): Promise<any> {
    try {
      if (!productId && !viandId) {
        throw new BadRequestException('Product or viand is required');
      }
      const getCart = await this.cartService.getCartById(cartId);
      const getProduct = await this.productService.getProductById(productId);
      const getViand = await this.viandService.getViandById(viandId);

      const allElementsInCart = await this.getElementsInCartByCartId(cartId);

      // Si el producto / vianda ya existe en el carrito, aumentamos la cantidad en 1 unidad.
      for (const element of allElementsInCart) {
        if (element.product?.productId === productId && getProduct) {
          element.quantity += 1;
          return await this.cartItemRepository.save(element);
        }
        if (element.viand?.viandId === viandId && getViand) {
          element.quantity += 1;
          return await this.cartItemRepository.save(element);
        }
      }

      const cartItem = this.cartItemRepository.create({
        cart: getCart,
        product: getProduct || null,
        viand: getViand || null,
        quantity: 1,
      });

      return await this.cartItemRepository.save(cartItem);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof BadGatewayException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error adding product to cart');
    }
  }

  // Metodo utilizado para agregar productos / viandas al carrito desde el local storage. (Se ejecuta al iniciar sesion)
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
      // Obtenemos todos los elementos en el carrito
      const allElementsInCart = await this.getElementsInCartByCartId(cartId);

      let productsToAddList = [];

      if (products?.length > 0) {
        for (const product of products) {
          const productToAdd: Product =
            await this.productService.getProductById(product.productId);

          const existentProducts = allElementsInCart.filter((product) => {
            return product.product?.productId === productToAdd.productId;
          });

          if (existentProducts.length > 0) {
            for (const existentProduct of existentProducts) {
              existentProduct.quantity += product.quantity;
              productsToAddList.push(existentProduct);
            }
            continue;
          } else {
            productsToAddList.push({
              product: productToAdd,
              quantity: product.quantity,
              cart,
            });
          }
        }
      }

      if (viands?.length > 0) {
        for (const viand of viands) {
          const viandToAdd: Viand = await this.viandService.getViandById(
            viand.viandId,
          );

          const existentViands = allElementsInCart.filter((viand) => {
            return viand.viand?.viandId === viandToAdd.viandId;
          });

          if (existentViands.length > 0) {
            for (const existentViand of existentViands) {
              existentViand.quantity += viand.quantity;
              productsToAddList.push(existentViand);
            }
            continue;
          } else {
            productsToAddList.push({
              viand: viandToAdd,
              quantity: viand.quantity,
              cart,
            });
          }
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

  async getElementsInCartByCartId(cartId: string) {
    try {
      return await this.cartItemRepository.find({
        where: { cart: { cartId } },
        relations: ['product', 'viand'],
      });
    } catch (error) {
      throw new BadGatewayException('Error getting elements in cart');
    }
  }

  async addSubtractUnity(
    cartId: string,
    elementId: string,
    { action }: AddSubtractUnityDto,
  ): Promise<CartItem> {
    try {
      const allElementsInCart = await this.getElementsInCartByCartId(cartId);

      for (const element of allElementsInCart) {
        if (element.product) {
          if (element.product.productId === elementId) {
            if (action === 'add') {
              element.quantity += 1;
            } else {
              if (element.quantity === 1) {
                return;
              }
              element.quantity -= 1;
            }
            return await this.cartItemRepository.save(element);
          }
        } else {
          if (element.viand?.viandId === elementId) {
            if (action === 'add') {
              element.quantity += 1;
            } else {
              if (element.quantity === 1) {
                return;
              }
              element.quantity -= 1;
            }
            return await this.cartItemRepository.save(element);
          }
        }
      }
    } catch (error) {
      throw new BadGatewayException('Error adding or subtracting unity');
    }
  }

  /**
   * Metodo utilizado para vaciar el carrito del usuario activo
   *
   * @param cartId - ID del carrito activo
   * @returns - Cantidad de filas afectadas
   */
  async emptyCart(cartId: string) {
    try {
      return await this.cartItemRepository.delete({ cart: { cartId } });
    } catch (error) {
      throw new BadGatewayException('Error emptying cart');
    }
  }
}
