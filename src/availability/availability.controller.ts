import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  createProfessionalSchedule(
    @Body() createAvailabilityDto: CreateAvailabilityDto,
  ) {
    return this.availabilityService.createProfessionalSchedule(
      createAvailabilityDto,
    );
  }

  @Get()
  getAvailableTimesByProfessional(
    @Query('professional') professional: string,
    @Query('date') date: Date,
  ) {
    return this.availabilityService.getAvailableTimesByProfessional(
      professional,
      date,
    );
  }
}
