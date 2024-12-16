import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from '../specialty/entities/specialty.entity';
import { SpecialtyService } from '../specialty/specialty.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Professional } from './entities/professional.entity';
import { AvailabilityService } from 'src/availability/availability.service';

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
      throw new BadGatewayException('Error trying to find professional by id');
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

  modifyProfessional(
    professionalId: string,
    updatedProfessional: UpdateProfessionalDto,
    file: Express.Multer.File,
  ) {
    try {
      // return this.professionalRepository.update(professionalId, {
      //   ...updatedProfessional,
      //   image: file ? file.filename : undefined,
      // });
    } catch (error) {
      throw new BadGatewayException('Error modifying professional by id');
    }
  }

  deleteProfessional(professionalId: string) {
    try {
      return this.professionalRepository.delete(professionalId);
    } catch (error) {
      throw new BadGatewayException('Error deleting professional');
    }
  }
}
