import {
  Injectable,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Professional } from './entities/professional.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
  ) {}

  create({
    fullname,
    specialty,
    email,
    phone,
    facebookURL,
    youtubeURL,
    instagramURL,
  }: CreateProfessionalDto): Promise<Professional> {
    try {
      const professional: Professional = new Professional();

      professional.professionalId = crypto.randomUUID();
      professional.fullname = fullname;
      professional.specialty = specialty;
      professional.email = email;
      professional.phone = phone;
      professional.facebookURL = facebookURL ? facebookURL : null;
      professional.youtubeURL = youtubeURL ? youtubeURL : null;
      professional.instagramURL = instagramURL ? instagramURL : null;

      return this.professionalRepository.save(professional);
    } catch (error) {
      throw new BadGatewayException('Error creating professional');
    }
  }

  findAll(): Promise<Professional[]> {
    try {
      return this.professionalRepository.find();
    } catch (error) {
      throw new BadGatewayException('Error finding all services');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} professional`;
  }

  update(id: number, updateProfessionalDto: UpdateProfessionalDto) {
    return `This action updates a #${id} professional`;
  }

  remove(id: number) {
    return `This action removes a #${id} professional`;
  }

  async findProfessionalById(professionalId: string): Promise<Professional> {
    try {
      const professional = await this.professionalRepository.findOne({
        where: { professionalId },
      });

      if (!professional) {
        throw new NotFoundException('Professional not found');
      }

      return professional;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadGatewayException('Error trying to find professional by id');
    }
  }
}
