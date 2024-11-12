import {
  Injectable,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ILike, Repository } from 'typeorm';
import ServiceDto from './dto/service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  createService({
    title,
    description,
    price,
    image,
  }: ServiceDto): Promise<Service> {
    try {
      const service: Service = new Service();
      service.serviceId = crypto.randomUUID();
      service.title = title;
      service.description = description;
      service.price = price;
      service.image = image;

      return this.serviceRepository.save(service);
    } catch (error) {
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
}
