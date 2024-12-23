import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { AddIngredientsInterface } from '../interfaces/AddIngredients.interface';

export class CreateViandDto {
  @IsString()
  name: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  stock: string;

  @IsString()
  description: string;

  @IsOptional()
  image?: string;

  @IsArray()
  ingredients: AddIngredientsInterface[];
}
