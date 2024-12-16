import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post(':professionalId')
  createProfessionalScheduleByArray(
    @Param('professionalId') professionalId: string,
    @Body() createAvailabilityDto: CreateAvailabilityDto[],
  ) {
    return this.availabilityService.createProfessionalScheduleByArray(
      professionalId,
      createAvailabilityDto,
    );
  }

  @Get()
  getAvailableTimesByProfessional(
    @Query('professional') professional: string,
    @Query('date') date: string,
  ) {
    return this.availabilityService.getAvailableTimesByProfessional(
      professional,
      date,
    );
  }
}
