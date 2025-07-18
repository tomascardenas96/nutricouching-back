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
import { TokenGuard } from 'src/auth/guard/token.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ActiveUser } from 'src/common/decorators/Active-user.decorator';
import { ActiveUserInterface } from 'src/common/interface/Active-user.interface';

@Controller('booking')
@UseGuards(TokenGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @UseGuards(TokenGuard)
  @Post('create')
  create(@Body() createBookingDto: CreateBookingDto, @ActiveUser() activeUser: ActiveUserInterface) {
    return this.bookingService.create(createBookingDto, activeUser);
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

  @Delete('delete/:bookingId/active-user/:userId')
  async cancelBooking(
    @Param('bookingId') bookingId: string,
    @Param('userId') activeUserId: string,
  ) {
    return await this.bookingService.cancelBooking(bookingId, activeUserId);
  }
}
