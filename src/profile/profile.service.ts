import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { ActiveUserInterface } from 'src/common/interface/Active-user.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) { }

  findAll() {
    return `This action returns all profile`;
  }

  async findOne(profileId: string) {
    try {
      const profile = await this.profileRepository.findOne({
        where: { profileId },
      });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      return profile;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error getting profile by id');
    }
  }

  async updateProfilePicture(file: Express.Multer.File, profileId: string) {
    try {
      const updatePhoto = await this.profileRepository.update(profileId, {
        picture: file.filename
      })

      if (updatePhoto.affected === 0) {
        throw new BadRequestException('Invalid File')
      }

      return { filename: file.filename }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating profile picture')
    }
  }

  async updateProfileCover(file: Express.Multer.File, profileId: string) {
    try {
      const updatePhoto = await this.profileRepository.update(profileId, {
        coverPhoto: file.filename
      })

      if (updatePhoto.affected === 0) {
        throw new BadRequestException('Invalid File')
      }

      return { filename: file.filename }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating profile cover')
    }
  }

  async findOneByProfileName(profileName: string) {
    try {
      const profile = await this.profileRepository.findOne({
        where: { profileName },
      });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      return profile;
    } catch (error) {
      throw new InternalServerErrorException("Error finding profile by profile name")
    }
  }
}
