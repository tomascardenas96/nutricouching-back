import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { Professional } from 'src/professional/entities/professional.entity';
import { ILike, Repository } from 'typeorm';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { Specialty } from './entities/specialty.entity';

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
    private readonly categoryService: CategoryService,
  ) { }

  /**
   * Metodo para crear una nueva especialidad
   *
   * @param CreateSpecialtyDto - Un objeto del tipo CreateSpecialtyDto (name, serviceId)
   * @returns - El objeto guardado
   */
  async createSpecialty({
    name,
    categoryId,
  }: CreateSpecialtyDto): Promise<Specialty> {
    try {
      const allSpecialties: Specialty[] = await this.findAll();
      const isSpecialtyExistent: boolean = allSpecialties.some((sp) => {
        return sp.name.toLowerCase() === name.toLowerCase();
      });

      if (isSpecialtyExistent) {
        throw new BadRequestException('Specialty already exists');
      }

      const category = await this.categoryService.findOne(categoryId);

      const specialty: Specialty = this.specialtyRepository.create({
        name,
        category,
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

  /**
   * Metodo que devuelve todas las especialidades de un profesional
   *
   * @param professionalId - ID del profesional
   * @returns - Lista con las especialidades de un profesional
   */
  async getSpecialtiesByProfessional(professionalId: string) {
    try {
      const professional = await this.professionalRepository.findOne({
        where: { professionalId },
        relations: ['specialty'],
      });

      return professional.specialty;
    } catch (error) {
      throw new BadGatewayException(
        'Error getting specialties by professional',
      );
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

  /**
   * Metodo para asignar una especialidad a un profesional
   *
   * @param professionalId - ID del profesional
   * @param specialtyId - ID de la especialidad a asignar
   * @returns - Profesional con las especialidades actualizadas
   */
  async assignSpecialtyToAProfessional(
    professionalId: string,
    specialtyId: string,
  ) {
    try {
      const activeProfessional = await this.professionalRepository.findOne({
        where: { professionalId },
      });

      if (!activeProfessional) {
        throw new NotFoundException('Professional not found');
      }

      const specialty = await this.getSpecialtyById(specialtyId);

      activeProfessional.specialty.push(specialty);

      return await this.professionalRepository.save(activeProfessional);
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof NotFoundException
      )
        throw new BadGatewayException(
          'Error assigning specialty to professional',
        );
    }
  }

  /**
   * Metodo para desvincular una especialidad de un profesional
   *
   * @param professionalId
   * @param specialtyId
   */
  async unassignSpecialtyOfProfessional(
    professionalId: string,
    specialtyId: string,
  ) {
    try {
      const activeProfessional = await this.professionalRepository.findOne({
        where: { professionalId },
      });

      if (!activeProfessional) {
        throw new NotFoundException('Professional not found');
      }

      const filteredSpecialties = activeProfessional.specialty.filter(
        (specialty) => specialty.specialtyId !== specialtyId,
      );

      activeProfessional.specialty = filteredSpecialties;

      return await this.professionalRepository.save(activeProfessional);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadGatewayException
      )
        throw new BadGatewayException(
          'Error unlinking specialty of a professional ',
        );
    }
  }

  /**
   * Metodo para eliminar una especialidad
   *
   * @param specialtyId - ID de la especialidad
   * @returns - Mensaje exito seguido del id de la especialidad eliminada o un mensaje que ninguna fila fue afectada
   */
  async deleteSpecialty(specialtyId: string) {
    try {
      const deletedRow = await this.specialtyRepository.delete(specialtyId);

      if (deletedRow.affected === 0) {
        return deletedRow;
      }

      return {
        message: 'Specialty deleted',
        id: specialtyId,
      };
    } catch (error) {
      throw new BadGatewayException('Error deleting specialty');
    }
  }

  /**
   *
   * @param specialtyId
   * @param param1
   * @returns
   */
  async modifySpecialty(
    specialtyId: string,
    { name, categoryId }: UpdateSpecialtyDto,
  ) {
    try {
      const category = await this.categoryService.findOne(categoryId);
      const updatedSpecialty = await this.specialtyRepository.update(
        specialtyId,
        { name, category },
      );

      if (updatedSpecialty.affected === 0) {
        throw new NotFoundException('Specialty not found');
      }

      return {
        specialtyId,
        name: name ? name : null,
        category: category ? category : null,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error modifying specialty');
    }
  }

  async getSpecialtiesByCategory(id: string) {
    try {
      return await this.specialtyRepository.find({ where: { category: { categoryId: id } } })
    } catch (error) {
      throw new InternalServerErrorException("Error getting specialties by category id")
    }
  }
}
