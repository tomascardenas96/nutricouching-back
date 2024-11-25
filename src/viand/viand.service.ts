import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Viand } from './entities/viand.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateViandDto } from './dto/create-viand.dto';
import { UpdateViandDto } from './dto/update-viand.dto';

@Injectable()
export class ViandService {
  constructor(
    @InjectRepository(Viand)
    private readonly viandRepository: Repository<Viand>,
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
      return this.viandRepository.save(viand);
    } catch (error) {
      if (error instanceof BadRequestException) {
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
}
