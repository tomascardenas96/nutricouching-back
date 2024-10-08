import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from './entities/availability.entity';
import { ProfessionalModule } from 'src/professional/professional.module';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Availability]),
    ProfessionalModule,
    BookingModule,
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
})
export class AvailabilityModule {}
