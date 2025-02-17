import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { CartService } from 'src/cart/cart.service';
import { Cart } from 'src/cart/entities/cart.entity';
import { Professional } from 'src/professional/entities/professional.entity';
import { CartItem } from 'src/cart-item/entities/Cart-item.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly cartService: CartService,
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

      const existentUserName: User = await this.userRepository.findOne({
        where: { username: user.username },
      });

      if (!!existentUserName) {
        throw new BadRequestException('Username already exists');
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
      const user = await this.userRepository.findOne({
        where: { userId},
        relations: ['cart']
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

  //   Crear metodo para cambiar la contraseña, eliminar usuario (soft delete).
}
