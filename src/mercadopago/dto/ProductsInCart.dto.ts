import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { Viand } from 'src/viand/entities/viand.entity';

export class ProductsInCartDto {
  @IsNotEmpty()
  cartItemId: string;

  @IsNotEmpty()
  cart: Cart;

  @IsOptional()
  product?: Product;

  @IsOptional()
  viand?: Viand;

  @IsNumber()
  quantity: number;
}
