import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
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

  async createUser(user: CreateUserDto) {
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

  findUserByEmail(email: string) {
    try {
      return this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw new Error('Error getting user by email');
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

  async findUserByEmailOrUsername(
    email?: string,
    username?: string,
  ): Promise<User> {
    if (!email && !username) {
      throw new BadRequestException('Email or username required');
    }
    const user: User = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  //   Crear metodo para cambiar la contraseña, eliminar usuario (soft delete).
}
