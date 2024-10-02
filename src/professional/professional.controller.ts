import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AssignServiceDto } from './dto/assign-service.dto';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { ProfessionalService } from './professional.service';

@Controller('professional')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post('create')
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalService.create(createProfessionalDto);
  }

  @Get()
  findAll() {
    return this.professionalService.findAll();
  }

  @Post('assign-service')
  assignService(@Body() assignServiceDto: AssignServiceDto) {
    return this.professionalService.assignService(assignServiceDto);
  }

  @Get('service')
  findProfessionalsByService(@Query('id') serviceId: string) {
    return this.professionalService.findProfessionalsByService(serviceId);
  }
}
