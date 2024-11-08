import {
  Injectable,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Professional } from './entities/professional.entity';
import { Repository } from 'typeorm';
import { ServiceService } from 'src/service/service.service';
import { AssignServiceDto } from './dto/assign-service.dto';
import { Service } from 'src/service/entities/service.entity';

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
    private readonly serviceService: ServiceService,
  ) {}

  create({
    fullname,
    specialty,
    email,
    phone,
    facebookURL,
    youtubeURL,
    instagramURL,
  }: CreateProfessionalDto): Promise<Professional> {
    try {
      const professional: Professional = new Professional();

      professional.professionalId = crypto.randomUUID();
      professional.fullname = fullname;
      professional.specialty = specialty;
      professional.email = email;
      professional.phone = phone;
      professional.facebookURL = facebookURL ? facebookURL : null;
      professional.youtubeURL = youtubeURL ? youtubeURL : null;
      professional.instagramURL = instagramURL ? instagramURL : null;

      return this.professionalRepository.save(professional);
    } catch (error) {
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

  async assignService({
    professionalId,
    serviceId,
  }: AssignServiceDto): Promise<Professional> {
    try {
      const professional: Professional =
        await this.findProfessionalById(professionalId);
      const service: Service =
        await this.serviceService.findServiceById(serviceId);

      //Si no existe ningun servicio para este profesional, se inicializara con un arreglo vacio su propiedad service.
      if (!professional.service) {
        professional.service = [];
      }

      //En caso que exista un servicio asignado que coincida con el servicio a agregar no se realizara ninguna operacion,
      //De lo contrario se hara un push con el servicio dentro del arreglo de servicios de la entidad 'professional'.
      const isAssignedService: boolean = professional.service.some(
        (assignedService) => assignedService.serviceId === service.serviceId,
      );

      if (!isAssignedService) {
        professional.service.push(service);
      }

      return await this.professionalRepository.save(professional);
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

  async findProfessionalById(professionalId: string): Promise<Professional> {
    try {
      const professional = await this.professionalRepository.findOne({
        where: { professionalId },
        relations: ['service'],
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

  async findProfessionalsByService(serviceId: string): Promise<Professional[]> {
    try {
      const service: Service =
        await this.serviceService.findServiceById(serviceId);

      return this.professionalRepository.find({ where: { service } });
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
}
