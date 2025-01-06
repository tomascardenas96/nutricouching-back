import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddIngredientsInterface } from '../interfaces/AddIngredients.interface';
import { Type } from 'class-transformer';

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

  @IsOptional()
  ingredients: AddIngredientsInterface[];
}
