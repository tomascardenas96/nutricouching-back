import {
  Injectable,
  BadGatewayException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';
import ServiceDto from './dto/service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  createService(
    { title, description, price }: ServiceDto,
    file: Express.Multer.File,
  ): Promise<Service> {
    try {
      // Como envio los datos via FormData, price tiene que llegar como string (por eso verifico que sea un numero)
      if (isNaN(Number(price))) {
        throw new BadRequestException('Price must be a number');
      }

      if (!file) {
        throw new BadRequestException('Image required');
      }

      const service: Service = new Service();

      service.serviceId = crypto.randomUUID();
      service.title = title;
      service.description = description;
      service.price = Number(price);
      service.image = file ? file.filename : undefined;

      return this.serviceRepository.save(service);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadGatewayException('Error creating new service');
    }
  }

  async findServiceById(serviceId: string): Promise<Service> {
    try {
      const service: Service = await this.serviceRepository.findOne({
        where: { serviceId },
      });

      if (!service) {
        throw new NotFoundException('Service not found');
      }

      return service;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadGatewayException('Error trying to find service by ID');
    }
  }

  findAll(): Promise<Service[]> {
    try {
      return this.serviceRepository.find();
    } catch (error) {
      throw new BadGatewayException('Error finding all services');
    }
  }

  getServiceByName(title: string): Promise<Service[]> {
    try {
      return this.serviceRepository.find({
        where: { title: ILike(`%${title}%`) },
      });
    } catch (error) {
      throw new BadGatewayException('Error trying to find service by name');
    }
  }

  async deleteService(serviceId: string): Promise<DeleteResult> {
    try {
      const service: Service = await this.findServiceById(serviceId);
      return this.serviceRepository.delete(service);
    } catch (error) {
      throw new BadGatewayException('Error deleting service');
    }
  }

  async modifyProduct(
    serviceId: string,
    updatedService: UpdateServiceDto,
    file: Express.Multer.File,
  ) {
    try {
      const existentService = await this.findServiceById(serviceId);
      await this.serviceRepository.update(serviceId, {
        ...updatedService,
        price: Number(updatedService.price),
        image: file ? file.filename : existentService.image,
      });

      return {
        ...existentService,
        ...updatedService,
        image: file ? file.filename : existentService.image,
      };
    } catch (error) {
      throw new BadGatewayException('Error modifying service by id');
    }
  }
}
