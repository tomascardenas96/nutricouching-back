import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { TokenGuard } from 'src/auth/guard/token.guard';

@Controller('ingredient')
@UseGuards(TokenGuard)
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post('list')
  create(@Body() createIngredientDto: CreateIngredientDto[]) {
    return this.ingredientService.createIngredientsByArray(createIngredientDto);
  }
}
