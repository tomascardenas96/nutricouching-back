import { Controller, Post, Body, Get } from '@nestjs/common';
import { ServiceService } from './service.service';
import ServiceDto from './dto/service.dto';
import { Service } from './entities/service.entity';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('create')
  createService(@Body() serviceDto: ServiceDto): Promise<Service> {
    return this.serviceService.createService(serviceDto);
  }

  @Get()
  findAll(): Promise<Service[]> {
    return this.serviceService.findAll();
  }
}
