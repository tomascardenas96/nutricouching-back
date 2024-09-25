import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Availability } from './entities/availability.entity';
import { Repository } from 'typeorm';
import { ProfessionalService } from 'src/professional/professional.service';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    private readonly professionalService: ProfessionalService,
  ) {}

  async create(createAvailabilityDto: CreateAvailabilityDto) {
    const { professionalId, days, startTime, endTime } = createAvailabilityDto;
    try {
      const professional =
        await this.professionalService.findProfessionalById(professionalId);

      if (!professional) {
        throw new NotFoundException('Professional not found');
      }

      const availabilities: Availability[] = [];

      for (const day of days) {
        const availabilityId = crypto.randomUUID();
        const availability = this.availabilityRepository.create({
          availabilityId,
          day,
          startTime,
          endTime,
          professional,
        });

        availabilities.push(availability);
      }

      return this.availabilityRepository.save(availabilities);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadGatewayException(
        'Error creating availability of professionals',
      );
    }
  }

  findAll() {
    return `This action returns all availability`;
  }

  findOne(id: number) {
    return `This action returns a #${id} availability`;
  }

  update(id: number, updateAvailabilityDto: UpdateAvailabilityDto) {
    return `This action updates a #${id} availability`;
  }

  remove(id: number) {
    return `This action removes a #${id} availability`;
  }
}
