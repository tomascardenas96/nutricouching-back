import {
  Body,
  Controller,
  Get,
  Post,
  Query
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('create')
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get('professional')
  async getBookingsByProfessional(
    @Query('professionalId') professionalId: string,
  ) {
    return this.bookingService.getBookingsByProfessional(professionalId);
  }

  @Get('available')
  async isDateAvailable(
    @Query('date') date: string,
    @Query('professionalId') professionalId: string,
  ) {
    return this.bookingService.isDateAvailable(new Date(date), professionalId);
  }
}
