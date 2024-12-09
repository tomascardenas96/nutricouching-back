import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException
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

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
    // private readonly serviceService: ServiceService,
    private readonly userService: UserService,
    private readonly specialtyService: SpecialtyService,
  ) {}

  async create(
    { userId, specialtyId, availability }: CreateProfessionalDto,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      // if (!file) {
      //   throw new BadRequestException('File non-selected');
      // }

      //Obtenemos por Id al usuario que queremos definir como profesional.
      const user: User = await this.userService.findUserById(userId);

      //Creamos una instancia de la clase Professional
      const professional: Professional = new Professional();

      //
      const specialties = await this.getSpecialitiesByArrayOfIds(specialtyId);
      // const createAvailability =
      //   await this.availabilityService.createProfessionalScheduleByArray(
      //     availability,
      //   );

      professional.professionalId = crypto.randomUUID();
      professional.fullname = `${user.name} ${user.lastname}`;
      professional.email = user.email;
      professional.image = file ? file.filename : undefined;
      professional.specialty = specialties;

      return this.professionalRepository.save(professional);
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

  private async getSpecialitiesByArrayOfIds(specialtyId: string[]) {
    try {
      const specialties = [];

      specialtyId.forEach(async (spId) => {
        const specialty: Specialty =
          await this.specialtyService.getSpecialtyById(spId);

        specialties.push(specialty);
      });

      return specialties;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadGatewayException
      ) {
        throw error;
      }

      throw new BadGatewayException(
        'Error trying to assign service to professional',
      );
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
