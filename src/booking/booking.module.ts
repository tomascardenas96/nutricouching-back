import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalModule } from '../professional/professional.module';
import { ServiceModule } from '../service/service.module';
import { UserModule } from '../user/user.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { Availability } from 'src/availability/entities/availability.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    ServiceModule,
    UserModule,
    ProfessionalModule,
    NotificationModule,
    SocketModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
