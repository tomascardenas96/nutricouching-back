import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingModule } from '../booking/booking.module';
import { ProfessionalModule } from '../professional/professional.module';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { Availability } from './entities/availability.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Availability]),
    BookingModule,
    ProfessionalModule,
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
