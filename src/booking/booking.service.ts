import {
  BadGatewayException,
  BadRequestException,
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
      //Verificamos primero si existe la reservacion.
      const isBookingExistent: Booking[] = await this.bookingRepository.find({
        where: {
          startTime: createBookingDto.startTime,
          endTime: createBookingDto.endTime,
          date: createBookingDto.date,
        },
      });

      if (isBookingExistent.length) {
        throw new BadRequestException('Booking existent');
      }

      //Y luego la creamos.
      const booking: Booking = new Booking();

      booking.date = new Date(createBookingDto.date + 'T00:00:00');

      booking.startTime = createBookingDto.startTime;

      booking.endTime = createBookingDto.endTime;

      booking.interval = createBookingDto.interval;

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

      booking.specialtyId = createBookingDto.specialtyId;

      return this.bookingRepository.save(booking);
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error creating booking');
    }
  }

  async getBookingsByProfessional(professionalId: string): Promise<Booking[]> {
    try {
      const professional: Professional =
        await this.professionalService.findProfessionalById(professionalId);

      return await this.bookingRepository.find({
        where: { professional },
        select: ['date', 'startTime', 'endTime'],
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadGatewayException('Error getting bookings by professional');
    }
  }

  async getBookingsByProfessionalByOrder(professionalId: string) {
    try {
      const professional: Professional =
        await this.professionalService.findProfessionalById(professionalId);

      const bookings: Booking[] = await this.bookingRepository.find({
        where: { professional },
        select: ['date', 'startTime', 'endTime', 'specialtyId'],
      });

      const noRepeatedDates = new Set();

      bookings.forEach((booking) => {
        noRepeatedDates.add(booking.date);
      });

      const splitedBookings: Record<string, any[]> = {};

      noRepeatedDates.forEach((date) => {
        const filterBookingsByDay = bookings.filter((booking) => {
          return booking.date === date;
        });

        splitedBookings[date.toString()] = filterBookingsByDay;
      });

      const sortedDate = this.sortScheduleByDate(splitedBookings);

      return sortedDate;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadGatewayException('Error getting bookings by professional');
    }
  }

  private sortScheduleByDate(schedule) {
    // Convertir el objeto en un arreglo de pares clave-valor
    const entries = Object.entries(schedule);

    // Ordenar el arreglo por fecha
    entries.sort(([dateA], [dateB]) => {
      const date1 = new Date(dateA).getTime();
      const date2 = new Date(dateB).getTime();
      return date1 - date2;
    });

    // Convertir el arreglo ordenado nuevamente en un objeto
    return Object.fromEntries(entries);
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
