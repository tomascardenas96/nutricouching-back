import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon'; // Importamos Luxon para manejar fechas y horas
import { Repository } from 'typeorm';
import { BookingService } from '../booking/booking.service';
import { Days } from '../common/enum/days.enum';
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

  /**
   * Crea un horario de disponibilidad para un profesional basado en un array de días y horarios.
   *
   * @param professionalId - ID del profesional para asignar los horarios.
   * @param av - Arreglo de objetos que contienen la información de los días y horarios de disponibilidad.
   * @returns Un arreglo con las disponibilidades creadas.
   */
  async createProfessionalScheduleByArray(
    professionalId: string,
    av: CreateAvailabilityDto[],
  ): Promise<Availability[]> {
    try {
      const availabilities: Availability[] = [];

      // Buscamos al profesional por ID
      const professional =
        await this.professionalService.findProfessionalById(professionalId);

      // Recorremos el arreglo de disponibilidades (av) y generamos los horarios
      av.forEach((item) => {
        item.day.forEach((day) => {
          // Convertimos las horas de inicio y fin en objetos DateTime
          let startTime = DateTime.fromISO(`1970-01-01T${item.startTime}`);
          const finalTime = DateTime.fromISO(`1970-01-01T${item.endTime}`);

          // Generamos intervalos de tiempo entre la hora de inicio y la hora de fin
          while (startTime < finalTime) {
            const start = startTime.toFormat('HH:mm');
            startTime = startTime.plus({ minutes: item.interval });
            const end = startTime.toFormat('HH:mm');

            // Si el tiempo de inicio excede el tiempo final, salimos del ciclo
            if (startTime > finalTime) break;

            // Creamos la disponibilidad para cada intervalo
            const availability: Availability =
              this.availabilityRepository.create({
                day,
                startTime: start,
                endTime: end,
                interval: item.interval,
                professional,
              });

            availabilities.push(availability);
          }
        });
      });

      // Guardamos las disponibilidades en la base de datos
      return await this.availabilityRepository.save(availabilities);
    } catch (error) {
      // Manejamos errores específicos o generales
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

  /**
   * Obtiene los horarios disponibles para un profesional en una fecha específica.
   *
   * @param professionalId - ID del profesional.
   * @param date - Fecha para la cual se consultan los horarios disponibles.
   * @returns Arreglo de disponibilidades que están libres para la fecha y profesional.
   */
  async getAvailableTimesByProfessional(
    professionalId: string,
    date: string,
  ): Promise<Availability[]> {
    try {
      // Buscamos al profesional
      const professional =
        await this.professionalService.findProfessionalById(professionalId);

      // Verificamos si la fecha solicitada es anterior al día actual
      if (this.verifyPreviousDay(date)) {
        return [];
      }

      // Convertimos la fecha a un formato de día de la semana (ej. 'Mon', 'Tue')
      const targetDate = DateTime.fromISO(date).toFormat('EEE');

      // Obtenemos todas las disponibilidades del profesional
      const availabilities = await this.availabilityRepository.find({
        where: { professional },
        order: { day: 'asc', startTime: 'asc' },
      });

      // Obtenemos los días de trabajo del profesional
      const workingDays =
        await this.getAvailableDaysByProfessional(professionalId);

      // Si el día solicitado no es un día de trabajo del profesional, retornamos un arreglo vacío
      if (!workingDays.includes(targetDate)) {
        return [];
      }

      // Obtenemos las reservas existentes para el profesional en la fecha solicitada
      const bookedSlots =
        await this.bookingService.getBookingsByProfessional(professionalId);

      // Creamos un conjunto de claves con las reservas para verificar la disponibilidad
      const bookedSet = new Set(
        bookedSlots.map((slot) => {
          const bookedDate = DateTime.fromISO(
            `${slot.date}T00:00:00`,
          ).toISODate();
          return `${bookedDate}:${slot.time}`;
        }),
      );

      // Filtramos las disponibilidades, asegurándonos que no estén reservadas
      return availabilities.filter((availability) => {
        const slotKey = `${DateTime.fromISO(date).toISODate()}:${availability.startTime}`;
        return (
          availability.day.substring(0, 3) === targetDate &&
          !bookedSet.has(slotKey)
        );
      });
    } catch (error) {
      // Manejamos errores específicos o generales
      if (
        error instanceof BadGatewayException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error trying to get available times');
    }
  }

  /**
   * Obtiene los días disponibles de un profesional.
   *
   * @param professionalId - ID del profesional.
   * @returns Un arreglo con los días de la semana que el profesional está disponible.
   */
  private async getAvailableDaysByProfessional(
    professionalId: string,
  ): Promise<Days[]> {
    try {
      const professional =
        await this.professionalService.findProfessionalById(professionalId);

      // Obtenemos las disponibilidades del profesional y ordenamos por día
      const availabilities = await this.availabilityRepository.find({
        where: { professional },
        order: { day: 'asc' },
      });

      // Devolvemos un conjunto de días únicos de disponibilidad
      return [
        ...new Set(availabilities.map((availability) => availability.day)),
      ];
    } catch (error) {
      // Manejamos errores en la obtención de días de disponibilidad
      throw new BadGatewayException(
        'Error getting available days by professional',
      );
    }
  }

  /**
   * Verifica si la fecha solicitada es anterior al día actual.
   *
   * @param date - Fecha a verificar.
   * @returns true si la fecha es anterior al día de hoy, false si no.
   */
  private verifyPreviousDay(date: string): boolean {
    const today = DateTime.local().toISODate();
    const targetDate = DateTime.fromISO(date).toISODate();

    return targetDate < today;
  }
}
