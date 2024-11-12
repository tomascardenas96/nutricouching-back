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

      if (isNaN(createViandDto.stock) || isNaN(createViandDto.price)) {
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
      const { name, price, stock, description } = viand;
      return this.viandRepository.findOne({
        where: { name, price, stock, description },
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
      return this.viandRepository.update(viandId, {
        ...updatedViand,
        image: file ? file.filename : undefined,
      });
    } catch (error) {
      throw new BadGatewayException('Error modifying viand by id');
    }
  }
}
