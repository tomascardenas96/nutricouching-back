import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { ServiceModule } from 'src/service/service.module';
import { UserModule } from 'src/user/user.module';
import { ProfessionalModule } from 'src/professional/professional.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    ServiceModule,
    UserModule,
    ProfessionalModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
