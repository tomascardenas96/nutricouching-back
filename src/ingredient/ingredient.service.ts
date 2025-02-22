import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async createIngredientsByArray(
    ingredients: CreateIngredientDto[],
  ): Promise<any> {
    try {
      // Extraer los nombres (o la propiedad única) de los ingredientes a verificar
      const ingredientNames = ingredients.map((ingredient) => ingredient.name);

      // Buscar los ingredientes que ya existen en la base de datos
      const existingIngredients = await this.ingredientRepository.find({
        where: { name: In(ingredientNames) }, // 'name' es el campo único, ajusta según tu modelo
      });

      // Extraer los nombres de los ingredientes que ya existen
      const existingNames = existingIngredients.map(
        (ingredient) => ingredient.name,
      );

      // Filtrar los ingredientes que no existen en la base de datos
      const newIngredients = ingredients.filter(
        (ingredient) => !existingNames.includes(ingredient.name),
      );

      // Crear y guardar solo los ingredientes nuevos
      if (newIngredients.length > 0) {
        const ingredientsList = newIngredients.map((ingredient) =>
          this.ingredientRepository.create(ingredient),
        );

        return this.ingredientRepository.save(ingredientsList);
      }

      return [];
    } catch (error) {
      throw new BadGatewayException('Error creating a new ingredient');
    }
  }
}
