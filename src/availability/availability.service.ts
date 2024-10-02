import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingService } from 'src/booking/booking.service';
import { Days } from 'src/common/enum/days.enum';
import { Professional } from 'src/professional/entities/professional.entity';
import { ProfessionalService } from 'src/professional/professional.service';
import { Repository } from 'typeorm';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { Availability } from './entities/availability.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    private readonly professionalService: ProfessionalService,
    private readonly bookingService: BookingService,
  ) {}

  //Creamos los dias y horarios en que el profesional va a atender.
  async createProfessionalSchedule(
    createAvailabilityDto: CreateAvailabilityDto,
  ) {
    const {
      professionalId,
      day,
      startTime,
      endTime,
      interval = 30,
    } = createAvailabilityDto;

    try {
      const professional =
        await this.professionalService.findProfessionalById(professionalId);

      if (!professional) {
        throw new NotFoundException('Professional not found');
      }

      const availabilities: Availability[] = [];

      let currentTime = new Date(`1970-01-01T${startTime}:00`);
      const finalTime = new Date(`1970-01-01T${endTime}:00`);

      //Iteramos hasta que el horario actual sea igual a la hora de finalizacion.
      while (currentTime < finalTime) {
        //A la fecha currentTime le extraemos la hora, la convertimos a string y posteriormente tomamos los primeros 5 caracteres de la cadena de texto generada.
        const start = currentTime.toTimeString().substring(0, 5);

        //Le agregamos la cantidad de minutos establecida en la variable interval.
        currentTime.setMinutes(currentTime.getMinutes() + interval);

        //Y aca volvemos a extraer el horario actualizado.
        const end = currentTime.toTimeString().substring(0, 5);

        const availability: Availability = this.availabilityRepository.create({
          day,
          startTime: start,
          endTime: end,
          professional,
        });

        availabilities.push(availability);
      }

      return await this.availabilityRepository.save(availabilities);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadGatewayException(
        'Error creating availability of professionals',
      );
    }
  }

  //Obtener los horarios disponibles por profesional.
  async getAvailableTimesByProfessional(
    professionalId: string,
    date: Date,
  ): Promise<Availability[]> {
    try {
      const professional: Professional =
        await this.professionalService.findProfessionalById(professionalId);

      const createDate = new Date(date + 'T00:00:00').toDateString();
      //Tomamos solo los primeros 3 caracteres para ver que dia de la semana es.
      const subtractedDate = createDate.substring(0, 3);

      const availabilities = await this.availabilityRepository.find({
        where: { professional },
        order: { day: 'asc', startTime: 'asc' },
      });

      const days = await this.getAvailableDaysByProfessional(professionalId);

      //Recorremos los horarios disponibles y verificamos si el dia en que el usuario solicita el turno el profesional trabaja, de ser negativo se retornara un arreglo vacio.
      const isWorkingToday = days.find((day) => {
        const subtractedAvailabilityDay = day.substring(0, 3);

        return subtractedDate === subtractedAvailabilityDay;
      });

      if (!isWorkingToday) {
        return [];
      }

      const bookedSlots =
        await this.bookingService.getBookingsByProfessional(professionalId);

      const bookedSet = new Set(
        bookedSlots.map((slot) => {
          const parsedDate = new Date(slot.date + 'T00:00:00');
          return `${parsedDate.toDateString()}:${slot.time}`;
        }),
      );

      const availableTimes = availabilities.filter((availability) => {
        const currentTime = availability.startTime + ':00';
        const subtractedDayOfAvailabilityObject = availability.day.substring(
          0,
          3,
        );

        // Verificar si ese horario ya fue reservado (compara con fecha y hora)
        return (
          !bookedSet.has(`${createDate}:${currentTime}`) &&
          subtractedDayOfAvailabilityObject === subtractedDate
        );
      });

      return availableTimes;
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error trying to get available times');
    }
  }

  private async getAvailableDaysByProfessional(
    professionalId: string,
  ): Promise<Days[]> {
    try {
      const professional: Professional =
        await this.professionalService.findProfessionalById(professionalId);

      const availabilities = await this.availabilityRepository.find({
        where: { professional },
        order: { day: 'asc' },
      });

      const days = availabilities.map((availability) => availability.day);

      return [...new Set(days)];
    } catch (error) {
      throw new BadGatewayException(
        'Error getting available days by professional',
      );
    }
  }
}
