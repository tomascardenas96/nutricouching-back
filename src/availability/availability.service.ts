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
                slotStart: item.startTime,
                slotEnd: item.endTime,
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

      // Filtramos las disponibilidades, asegurándonos que no estén reservadas
      return availabilities.filter((availability) => {
        const availabilityTime = DateTime.fromISO(
          availability.startTime,
        ).toFormat('HH:mm');

        // Verificamos si el horario está reservado
        const isBooked = bookedSlots.some((slot) => {
          const slotTime = DateTime.fromISO(slot.startTime).toFormat('HH:mm');
          return (
            DateTime.fromISO(slot.date).toISODate() ===
              DateTime.fromISO(date).toISODate() &&
            slotTime === availabilityTime
          );
        });

        // Retornamos solo las disponibilidades que coinciden con el día solicitado y no están reservadas
        return availability.day.substring(0, 3) === targetDate && !isBooked;
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

      const days = [
        ...new Set(availabilities.map((availability) => availability.day)),
      ];

      // Devolvemos un conjunto de días únicos de disponibilidad
      return days;
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

  /**
   * Obtiene las franjas de horario organizadas por turno.
   *
   * @param professionalId - ID del profesional.
   * @returns Un objeto con las franjas de horario organizadas por turno.
   */
  async getTimeSlotByProfessional(professionalId: string) {
    try {
      const professional =
        await this.professionalService.findProfessionalById(professionalId);

      const availabilities = await this.availabilityRepository.find({
        where: { professional },
      });

      const slots = new Set();

      availabilities.forEach((availability) => {
        slots.add(availability.day);
      });

      const listOfAvailabilities = [];

      slots.forEach((slot) => {
        const availabilitiesByDay = availabilities.filter(
          (availability) => availability.day === slot,
        );

        availabilitiesByDay.forEach((availability) => {
          if (
            !listOfAvailabilities.find((item) => {
              // Verificamos que no exista (para que no se repitan)
              return (
                item.day === slot &&
                item.startTime === availability.slotStart &&
                item.endTime === availability.slotEnd
              );
            })
          ) {
            listOfAvailabilities.push({
              day: slot,
              startTime: availability.slotStart,
              endTime: availability.slotEnd,
              interval: availability.interval,
            });
          }
        });
      });

      // Agrupar y ordenar
      const groupedAvailabilities = listOfAvailabilities.reduce(
        (acc, { day, startTime, endTime, interval }) => {
          if (!acc[day]) {
            acc[day] = [];
          }
          acc[day].push({ startTime, endTime, interval });
          return acc;
        },
        {},
      );

      // Ordenar por día
      const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const sortedGroupedAvailabilities = Object.keys(groupedAvailabilities)
        .sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)) // Ordena según el índice en `daysOrder`
        .reduce((acc, key) => {
          acc[key] = groupedAvailabilities[key];
          return acc;
        }, {});

      return sortedGroupedAvailabilities;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadGatewayException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error getting time slot by professional');
    }
  }

  /**
   * Metodo para eliminar una franja horaria de un profesional en especifico
   *
   * @param startTime - Hora de inicio de la franja horaria
   * @param professionalId - ID del profesional
   * @param day - Fecha de la franja horaria
   * @returns - Mensaje de confirmación
   */
  async deleteTimeSlot(startTime: string, professionalId: string, day: Days) {
    try {
      const professional =
        await this.professionalService.findProfessionalById(professionalId);

      const availabilities = await this.availabilityRepository.find({
        where: { professional, slotStart: startTime, day },
      });

      if (availabilities.length === 0) {
        throw new NotFoundException('Time slot not found');
      }

      return await this.availabilityRepository.remove(availabilities);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadGatewayException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error deleting time slot');
    }
  }

  /**
   * Agrega una nueva franja de horario de disponibilidad.
   *
   * @param professionalId - ID del profesional.
   * @body - Datos de la nueva franja de horario (inicio, fin, intervalo, dia de la semana)
   * @returns - Franja horaria creada
   */
  async addNewTimeSlot() {
    try {
    } catch (error) {}
  }
}
