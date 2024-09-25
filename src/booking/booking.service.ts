import { Injectable, BadGatewayException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceService } from 'src/service/service.service';
import { UserService } from 'src/user/user.service';
import { ProfessionalService } from 'src/professional/professional.service';
import { Professional } from 'src/professional/entities/professional.entity';

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

      booking.bookingId = crypto.randomUUID();
      booking.date = createBookingDto.date;
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

      return this.bookingRepository.find({
        where: { professional },
      });
    } catch (error) {
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

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
