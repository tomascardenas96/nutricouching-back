import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    // Verificamos si existe el email y nombre de usuario.
    const existentEmail = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existentEmail) {
      throw new BadRequestException('Email already exists');
    }

    const existentUserName = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (existentUserName) {
      throw new BadRequestException('Username already exists');
    }

    const randomId = crypto.randomUUID();
    const newUser = this.userRepository.create({ userId: randomId, ...user });

    return this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { email },
        select: ['email', 'password', 'userId'],
      });
    } catch (error) {
      throw new Error('Error getting user by email');
    }
  }

  async findUserById(userId: string): Promise<User> {
    try {
      return await this.userRepository.findOne({ where: { userId } });
    } catch (error) {
      throw new Error('Error getting user by id');
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

  //   Crear metodo para cambiar la contraseña, eliminar usuario (soft delete).
}
