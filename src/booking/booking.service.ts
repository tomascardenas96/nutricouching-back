import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Professional } from 'src/professional/entities/professional.entity';
import { ProfessionalService } from 'src/professional/professional.service';
import { ServiceService } from 'src/service/service.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly serviceService: ServiceService,
    private readonly userService: UserService,
    private readonly professionalService: ProfessionalService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    try {
      const booking: Booking = new Booking();

      booking.date = new Date(createBookingDto.date + 'T00:00:00');

      booking.time = createBookingDto.time;

      booking.service = await this.serviceService.findServiceById(
        createBookingDto.serviceId,
      );

      booking.user = await this.userService.findUserById(
        createBookingDto.userId,
      );

      booking.professional =
        await this.professionalService.findProfessionalById(
          createBookingDto.professionalId,
        );

      return this.bookingRepository.save(booking);
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }
      throw new BadGatewayException('Error creating booking');
    }
  }

  async getBookingsByProfessional(professionalId: string): Promise<Booking[]> {
    try {
      const professional: Professional =
        await this.professionalService.findProfessionalById(professionalId);

      if (!professional) {
        throw new NotFoundException('Professional not found');
      }

      return await this.bookingRepository.find({
        where: { professional },
        select: ['date', 'time'],
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
      }
      throw new BadGatewayException('Error getting bookings by professional');
    }
  }

  async isDateAvailable(date: Date, professionalId: string): Promise<boolean> {
    const professional =
      await this.professionalService.findProfessionalById(professionalId);

    const existingBooking = await this.bookingRepository.findOne({
      where: { date, professional },
    });

    return !existingBooking; // Retorna verdadero si no hay reserva para el profesional en esa fecha/hora
  }

}
