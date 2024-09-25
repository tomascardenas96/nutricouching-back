import { Injectable, BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entity/service.entity';
import { Repository } from 'typeorm';
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

  findServiceById(serviceId: string) {
    try {
      return this.serviceRepository.findOne({ where: { serviceId } });
    } catch (error) {
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
}
