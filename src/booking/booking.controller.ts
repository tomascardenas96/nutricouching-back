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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { TokenGuard } from 'src/auth/guard/token.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(TokenGuard)
  @Post('create')
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get('professional')
  async getBookingsByProfessionalByOrder(
    @Query('professionalId') professionalId: string,
  ) {
    return this.bookingService.getBookingsByProfessionalByOrder(professionalId);
  }

  @Get('user')
  async getBookingsByUser(@Query('userId') userId: string) {
    return this.bookingService.getBookingsByUser(userId);
  }

  @Get('available') 
  async isDateAvailable(
    @Query('date') date: string,
    @Query('professionalId') professionalId: string,
  ) {
    return this.bookingService.isDateAvailable(new Date(date), professionalId);
  }

  @Delete('delete/:bookingId')
  async cancelBooking(@Param('bookingId') bookingId: string) {
    return await this.bookingService.cancelBooking(bookingId);
  }
}
