import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create({ name }: CreateCategoryDto) {
    try {
      const isCategoryNameExistent = await this.isCategoryNameExistent(name);

      if (isCategoryNameExistent) {
        throw new BadRequestException('Category name already exist');
      }

      const category = this.categoryRepository.create({ name });
      await this.categoryRepository.save(category);

      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating category');
    }
  }

  private async isCategoryNameExistent(name: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { name },
      });

      return !!category;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error verifying if category already exist at database',
      );
    }
  }

  findAll() {
    try {
      return this.categoryRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error getting all categories');
    }
  }

  async findOne(categoryId: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error finding category by id');
    }
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
