import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Viand } from './entities/viand.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateViandDto } from './dto/create-viand.dto';
import { UpdateViandDto } from './dto/update-viand.dto';
import { IngredientService } from 'src/ingredient/ingredient.service';

@Injectable()
export class ViandService {
  constructor(
    @InjectRepository(Viand)
    private readonly viandRepository: Repository<Viand>,
    private readonly ingredientService: IngredientService,
  ) {}

  async createNewViand(
    createViandDto: CreateViandDto,
    file: Express.Multer.File,
  ) {
    try {
      const existentViand: Viand = await this.filterEntireViand(createViandDto);

      if (existentViand) {
        throw new BadRequestException('Viand already exists');
      }

      if (
        isNaN(Number(createViandDto.stock)) ||
        isNaN(Number(createViandDto.price))
      ) {
        throw new BadRequestException('Stock and price must be number');
      }

      const viand = this.viandRepository.create({
        ...createViandDto,
        stock: Number(createViandDto.stock),
        price: Number(createViandDto.price),
        image: file ? file.filename : null,
      });

      // Parseamos los ingredientes si vienen en formato JSON
      if (typeof createViandDto.ingredients === 'string') {
        createViandDto.ingredients = JSON.parse(createViandDto.ingredients);
      }

      const ingredients = await this.ingredientService.createIngredientsByArray(
        createViandDto.ingredients,
      );

      viand.ingredients = ingredients;

      return this.viandRepository.save(viand);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof BadGatewayException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error creating a new viand');
    }
  }

  private filterEntireViand(viand: CreateViandDto): Promise<Viand> {
    try {
      const { name, description } = viand;
      return this.viandRepository.findOne({
        where: { name, description },
      });
    } catch (error) {
      throw new BadGatewayException('Error getting entire viand');
    }
  }

  async getAllViands(): Promise<Viand[]> {
    try {
      return await this.viandRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      throw new BadGatewayException('Error getting all viands');
    }
  }

  async deleteViand(viandId: string): Promise<DeleteResult> {
    try {
      return this.viandRepository.delete(viandId);
    } catch (error) {
      throw new BadGatewayException('Error deleting viand by id');
    }
  }

  async modifyViand(
    viandId: string,
    updatedViand: UpdateViandDto,
    file: Express.Multer.File,
  ) {
    try {
      const existentViand = await this.viandRepository.findOne({
        where: { viandId },
      });

      await this.viandRepository.update(viandId, {
        ...updatedViand,
        price: Number(updatedViand.price),
        stock: Number(updatedViand.stock),
        image: file ? file.filename : existentViand.image,
      });

      return {
        ...existentViand,
        ...updatedViand,
        image: file ? file.filename : existentViand.image,
      };
    } catch (error) {
      throw new BadGatewayException('Error modifying viand by id');
    }
  }

  async getViandById(viandId: string): Promise<Viand> {
    try {
      const viand: Viand = await this.viandRepository.findOne({
        where: { viandId },
        order: { createdAt: 'DESC' },
      });

      if (!viand || !viandId) {
        return null;
      }

      return viand;
    } catch (error) {
      throw new BadGatewayException('Error getting viand by id');
    }
  }

  async subtractStockAfterPurchase(viands: { id: string; quantity: number }[]) {
    try {
      const viandsInCart: Viand[] = [];

      for (const viand of viands) {
        const foundViand = await this.getViandById(viand.id);

        if (!foundViand) {
          throw new BadGatewayException(
            `Vianda con ID ${viand.id} no encontrada`,
          );
        }

        foundViand.stock -= Number(viand.quantity);

        if (foundViand.stock < 0) {
          throw new BadGatewayException(
            `Stock insuficiente para la vianda ${viand.id}`,
          );
        }

        viandsInCart.push(foundViand);
      }

      if (!viandsInCart.length) {
        return [];
      }

      await this.viandRepository.save(viandsInCart);
    } catch (error) {
      throw new BadGatewayException('Error subtracting stock');
    }
  }
}
