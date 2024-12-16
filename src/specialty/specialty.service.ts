import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from './entities/specialty.entity';
import { ILike, Repository } from 'typeorm';
import { ServiceService } from 'src/service/service.service';
import { Service } from 'src/service/entities/service.entity';

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
    private readonly serviceService: ServiceService,
  ) {}

  async createSpecialty({
    name,
    serviceId,
  }: CreateSpecialtyDto): Promise<Specialty> {
    try {
      const allSpecialties: Specialty[] = await this.findAll();
      const isSpecialtyExistent: boolean = allSpecialties.some((sp) => {
        return sp.name.toLowerCase() === name.toLowerCase();
      });

      if (isSpecialtyExistent) {
        throw new BadRequestException('Specialty already exists');
      }

      const service: Service =
        await this.serviceService.findServiceById(serviceId);
      const specialty: Specialty = this.specialtyRepository.create({
        name,
        service,
      });

      return this.specialtyRepository.save(specialty);
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error creating specialty');
    }
  }

  findAll(): Promise<Specialty[]> {
    try {
      return this.specialtyRepository.find();
    } catch (error) {
      throw new BadGatewayException('Error getting all specialties');
    }
  }

  findByQuery(id: string): Promise<Specialty[]> {
    try {
      return this.specialtyRepository.find({
        where: { name: ILike(`%${id}%`) },
      });
    } catch (error) {
      throw new BadGatewayException('Error getting specialties by query');
    }
  }

  update(id: number, updateSpecialtyDto: UpdateSpecialtyDto) {
    return `This action updates a #${id} specialty`;
  }

  remove(id: number) {
    return `This action removes a #${id} specialty`;
  }

  async getSpecialtyById(specialtyId: string): Promise<Specialty> {
    try {
      return this.specialtyRepository.findOne({ where: { specialtyId } });
    } catch (error) {
      throw new BadGatewayException('Error getting specialty by id');
    }
  }

  async getSpecialtiesById(specialties: Specialty[]): Promise<Specialty[]> {
    try {
      const specialtiesList = await Promise.all(
        specialties.map(async (specialty) => {
          return this.getSpecialtyById(specialty.specialtyId);
        }),
      );

      return specialtiesList;
    } catch (error) {
      throw new BadGatewayException('Error getting specialty by id');
    }
  }

  async verifyAndCreateSpecialtiesByArray(
    createSpecialtyDto: CreateSpecialtyDto[],
  ): Promise<Specialty[]> {
    try {
      const existentSpecialties = await this.findAll();
      // Filtrar las especialidades que ya existen
      const newSpecialtiesToCreate = createSpecialtyDto.filter(
        (newSpecialty) =>
          !existentSpecialties.some(
            (existentSpecialty) =>
              existentSpecialty.name.toLowerCase() ===
              newSpecialty.name.toLowerCase(),
          ),
      );

      const createdSpecialties = await Promise.all(
        newSpecialtiesToCreate.map(async (specialty) => {
          return this.createSpecialty(specialty);
        }),
      );

      return createdSpecialties;
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }
      throw new BadGatewayException(
        'Error verifying and creating specialties by array',
      );
    }
  }

  async assignSpecialtyToAProfessional() {
    try {
    } catch (error) {}
  }
}
