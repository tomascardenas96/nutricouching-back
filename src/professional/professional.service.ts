import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Specialty } from '../specialty/entities/specialty.entity';
import { SpecialtyService } from '../specialty/specialty.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Professional } from './entities/professional.entity';

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
    private readonly userService: UserService,
    private readonly specialtyService: SpecialtyService,
  ) {}

  async create(
    { userId, specialties }: CreateProfessionalDto,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      // Buscar al usuario
      const user: User = await this.userService.findUserById(userId);

      const specialtiesArray = [];

      for (const sp of specialties) {
        const specialtiesByName = await this.specialtyRepository.findOne({
          where: { name: sp.name },
        });

        if (specialtiesByName) {
          specialtiesArray.push(specialtiesByName);
        }
      }

      // Crear la instancia de Professional
      const professional: Professional = this.professionalRepository.create({
        professionalId: crypto.randomUUID(),
        fullname: `${user.name} ${user.lastname}`,
        email: user.email,
        image: file ? file.filename : undefined,
        specialty: specialtiesArray,
        profile: {
          profileName: `${user.name.toLowerCase()}${user.lastname.toLowerCase()}${crypto.randomUUID().substring(0, 5)}`,
        },
      });

      // Guardar primero el Professional en la base de datos
      await this.professionalRepository.save(professional);

      // Asignar el Professional al User
      await this.userService.assignAsProfessional(userId, professional);

      return professional;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadGatewayException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error creating professional');
    }
  }

  findAll(): Promise<Professional[]> {
    try {
      return this.professionalRepository.find();
    } catch (error) {
      throw new BadGatewayException('Error finding all services');
    }
  }

  async getAvailabilityByArrayOfIds(availabilityId: string[]) {
    try {
    } catch (error) {
      throw new BadGatewayException(
        'Error getting availability by an array of availabilityId',
      );
    }
  }

  async findProfessionalById(professionalId: string): Promise<Professional> {
    try {
      const professional = await this.professionalRepository.findOne({
        where: { professionalId },
      });

      if (!professional) {
        throw new NotFoundException('Professional not found');
      }

      return professional;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error trying to find professional by id',
      );
    }
  }

  async findProfessionalByProfileName(slug: string): Promise<Professional> {
    try {
      const professional = await this.professionalRepository.findOne({
        where: { profile: { profileName: slug } },
      });

      if (!professional) {
        throw new NotFoundException('Professional not found');
      }

      return professional;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error trying to find professional by slug',
      );
    }
  }

  async findProfessionalsBySpecialty(
    specialtyId: string,
  ): Promise<Professional[]> {
    const specialty = await this.specialtyService.getSpecialtyById(specialtyId);

    if (!specialty) {
      throw new NotFoundException('Specialty not found');
    }

    try {
      return this.professionalRepository.find({ where: { specialty } });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadGatewayException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error getting professionals by service');
    }
  }

  /**
   * Filtrar lista de profesionales por query (nombre, especialidad o categoria)
   * AND & OR
   *
   * @query name
   * @query specialty
   * @query category
   * @returns Arreglo de profesionales
   */
  async filterProfessionals(
    every: string,
    name: string,
    specialty: string,
    category: string,
  ) {
    try {
      const query = this.professionalRepository
        .createQueryBuilder('professional')
        .leftJoinAndSelect('professional.specialty', 'specialty')
        .leftJoinAndSelect('specialty.category', 'category')
        .leftJoinAndSelect('professional.profile', 'profile');

      if (every) {
        query.where(
          new Brackets((qb) => {
            qb.where('LOWER(professional.fullname) LIKE :every', {
              every: `%${every.toLowerCase()}%`,
            })
              .orWhere('LOWER(specialty.name) LIKE :every', {
                every: `%${every.toLowerCase()}%`,
              })
              .orWhere('LOWER(category.name) LIKE :every', {
                every: `%${every.toLowerCase()}%`,
              });
          }),
        );

        return query.getMany();
      }

      if (name) {
        query.andWhere('LOWER(professional.fullname) LIKE :name', {
          name: `%${name.toLowerCase()}%`,
        });
      }

      if (specialty) {
        query.andWhere('LOWER(specialty.name) LIKE :specialty', {
          specialty: `%${specialty.toLowerCase()}%`,
        });
      }

      if (category) {
        query.andWhere('LOWER(category.name) LIKE :category', {
          category: `%${category.toLowerCase()}%`,
        });
      }

      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error filtering professionals by query',
      );
    }
  }

  async modifyProfessional(
    professionalId: string,
    updatedProfessional: UpdateProfessionalDto,
    file: Express.Multer.File,
  ) {
    try {
      const update = await this.professionalRepository.update(professionalId, {
        ...updatedProfessional,
        image: file ? file.filename : undefined,
      });

      if (update.affected === 0) {
        throw new NotFoundException('Professional not found');
      }

      return {
        id: professionalId,
        message: 'Professional updated succesfully',
        image: file ? file.filename : null,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadGatewayException('Error modifying professional by id');
    }
  }

  async deleteProfessional(professionalId: string) {
    try {
      const deleteProfessional =
        this.professionalRepository.delete(professionalId);

      if (!deleteProfessional) {
        throw new NotFoundException('Professional not found');
      }

      return {
        id: professionalId,
        message: 'Professional deleted succesfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadGatewayException('Error deleting professional');
    }
  }
}
