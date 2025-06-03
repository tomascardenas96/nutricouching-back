import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Professional } from 'src/professional/entities/professional.entity';
import { ILike, IsNull, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    try {
      return this.userRepository.find();
    } catch (error) {
      throw new BadGatewayException('Error getting all users');
    }
  }

  async createUser(user: CreateUserDto): Promise<User> {
    // Verificamos si existe el email y nombre de usuario.
    try {
      const existentEmail: User = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (!!existentEmail) {
        throw new BadRequestException('Email already exists');
      }

      const newUser: User = this.userRepository.create({ ...user });

      return this.userRepository.save(newUser);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof BadGatewayException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error creating a new user');
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['email', 'password', 'userId'],
      });

      if (!user) {
        throw new NotFoundException('User email not found');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadGatewayException('Error finding user by email');
    }
  }

  async findUserById(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { userId },
        relations: ['cart'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadGatewayException('Error getting user by id');
    }
  }

  async verifyUser(email: string) {
    try {
      const user = await this.findUserByEmail(email);

      user.isEmailConfirmed = true;

      return this.userRepository.save(user);
    } catch (error) {
      throw new Error('Error verifying user');
    }
  }

  async getNonProfessionalsUsersByEmail(email: string): Promise<User[]> {
    try {
      return this.userRepository.find({
        where: { email: ILike(`%${email}%`), professional: IsNull() },
      });
    } catch (error) {
      throw new BadGatewayException('Error getting users by email');
    }
  }

  async assignAsProfessional(
    userId: string,
    professional: Professional,
  ): Promise<User> {
    try {
      // Buscar al usuario existente
      const user = await this.userRepository.findOne({
        where: { userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Asociar el profesional al usuario
      user.professional = professional;

      // Guardar los cambios
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadGatewayException(
        'Error trying to assign a user as professional',
      );
    }
  }

  async updatePassword(userId: string, newPassword: string) {
    try {
      return this.userRepository.update(userId, { password: newPassword });
    } catch (error) {
      throw new BadGatewayException('Error updating user password');
    }
  }

  async modifyUserInformation(userId: string, updateUserDto: UpdateUserDto) {
    try {
      if (!updateUserDto.password) {
        return await this.userRepository.update(userId, {
          name: updateUserDto.name || undefined,
          lastname: updateUserDto.lastname || undefined,
        });
      }

      return await this.userRepository.update(userId, updateUserDto);
    } catch (error) {
      throw new BadGatewayException('Error morifying user information');
    }
  }

  async disableUser(userId: string) {
    try {
      return await this.userRepository.update(userId, { isDisabled: true });
    } catch (error) {
      throw new InternalServerErrorException('Error disabling user');
    }
  }

  //   Crear metodo para cambiar la contraseña, eliminar usuario (soft delete).
}
