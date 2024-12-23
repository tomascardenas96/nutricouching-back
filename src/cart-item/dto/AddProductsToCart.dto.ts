import { IsOptional } from 'class-validator';
import { ProductsWithQuantitiesInterface } from '../interfaces/ProductsWithQuantities.interface';
import { ViandsWithQuantitiesInterface } from '../interfaces/ViandsWithQuantities.interface';

export class AddProductsToCartDto {
  @IsOptional()
  products?: ProductsWithQuantitiesInterface[];

  @IsOptional()
  viands?: ViandsWithQuantitiesInterface[];
}
