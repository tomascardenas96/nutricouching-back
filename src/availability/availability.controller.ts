import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { Days } from 'src/common/enum/days.enum';
import { TokenGuard } from 'src/auth/guard/token.guard';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) { }

  @UseGuards(TokenGuard)
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

  @Get('professional/:professionalId')
  getTimeSlotByProfessional(@Param('professionalId') professionalId: string) {
    return this.availabilityService.getTimeSlotByProfessional(professionalId);
  }

  @UseGuards(TokenGuard)
  @Delete()
  deleteTimeSlot(
    @Query('startTime') startTime: string,
    @Query('professionalId') professionalId: string,
    @Query('day') day: Days,
  ) {
    return this.availabilityService.deleteTimeSlot(
      startTime,
      professionalId,
      day,
    );
  }
}
