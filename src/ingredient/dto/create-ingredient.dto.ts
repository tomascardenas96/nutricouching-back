import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Ingredient } from '../entities/ingredient.entity';
import { AddIngredientsInterface } from 'src/viand/interfaces/AddIngredients.interface';

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsArray()
  name: string;
}
