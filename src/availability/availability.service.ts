import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingService } from '../booking/booking.service';
import { Days } from '../common/enum/days.enum';
import { Professional } from '../professional/entities/professional.entity';
import { ProfessionalService } from '../professional/professional.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { Availability } from './entities/availability.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    private readonly bookingService: BookingService,
    private readonly professionalService: ProfessionalService,
  ) {}

  //Creamos los dias y horarios en que el profesional va a atender.
  async createProfessionalSchedule(
    createAvailabilityDto: CreateAvailabilityDto,
  ) {
    const { day, startTime, endTime, interval = 30 } = createAvailabilityDto;

    try {
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
          // professional,
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

  async createProfessionalScheduleByArray(
    av: CreateAvailabilityDto[],
  ): Promise<Availability[]> {
    try {
      //Creamos un arreglo vacio
      const availabilities: Availability[] = [];

      av.forEach((item) => {
        const interval = item.interval;

        for (let i: number = 0; i < item.day.length; i++) {
          //Creamos una variable para la hora de inicio y la hora de fin, dandole formato de tipo Date.
          let startTime = new Date(`1970-01-01T${item.startTime}:00`);
          const finalTime = new Date(`1970-01-01T${item.endTime}:00`);

          //Iteramos hasta que el horario actual sea igual a la hora de finalizacion.
          while (startTime < finalTime) {
            const dayValue = item.day[i] as Days;
            //A la fecha startTime le extraemos la hora, la convertimos a string y posteriormente tomamos los primeros 5 caracteres de la cadena de texto generada.
            const start = startTime.toTimeString().substring(0, 5);

            //Le agregamos la cantidad de minutos establecida en la variable interval.
            startTime.setMinutes(startTime.getMinutes() + interval);

            //Y aca volvemos a extraer el horario actualizado.
            const end = startTime.toTimeString().substring(0, 5);

            const availability: Availability =
              this.availabilityRepository.create({
                day: dayValue,
                startTime: start,
                endTime: end,
                interval: item.interval,
              });

            availabilities.push(availability);
          }
        }
      });

      return await this.availabilityRepository.save(availabilities);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadGatewayException
      ) {
        throw error;
      }
      console.error(error);
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

      //Verificamos si la fecha seleccionada no es un dia pasado, en tal caso se devolvera un arreglo vacio.
      const isAPreviousDay: boolean = this.verifyPreviousDay(date);
      if (isAPreviousDay) {
        return [];
      }

      const targetDateString = new Date(date + 'T00:00:00').toDateString();
      //Tomamos solo los primeros 3 caracteres para ver que dia de la semana es.
      const subtractedDate = targetDateString.substring(0, 3);

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
        const startTime = availability.startTime + ':00';
        const subtractedDayOfAvailabilityObject = availability.day.substring(
          0,
          3,
        );

        // Verificar si ese horario ya fue reservado (compara con fecha y hora)
        return (
          !bookedSet.has(`${targetDateString}:${startTime}`) &&
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

  //Obtener los dias en que el profesional trabaja.
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

  //Verifica si el dia elegido es menor al dia actual, de ser positivo devolvera un arreglo vacio al frontend.
  private verifyPreviousDay(date: Date): boolean {
    const today = new Date(Date.now()).toISOString();
    const targetISOString = new Date(date + 'T00:00:00').toISOString();

    return targetISOString < today;
  }
}
