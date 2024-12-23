import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { Repository } from 'typeorm';

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
      const ingredientsList = ingredients.map((ingredient) =>
        this.ingredientRepository.create(ingredient),
      );

      return this.ingredientRepository.save(ingredientsList);
    } catch (error) {
      throw new BadGatewayException('Error creating a new ingredient');
    }
  }

  findAll() {
    return `This action returns all ingredient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ingredient`;
  }

  update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return `This action updates a #${id} ingredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
