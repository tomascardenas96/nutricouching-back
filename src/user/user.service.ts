import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { CartService } from 'src/cart/cart.service';
import { Cart } from 'src/cart/entities/cart.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly cartService: CartService,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    // Verificamos si existe el email y nombre de usuario.
    try {
      const existentEmail: User = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (existentEmail) {
        throw new BadRequestException('Email already exists');
      }

      const existentUserName: User = await this.userRepository.findOne({
        where: { username: user.username },
      });
      if (existentUserName) {
        throw new BadRequestException('Username already exists');
      }

      //Creamos un carrito automaticamente
      const cart: Cart = await this.cartService.createCart();

      //Y lo asignamos al nuevo usuario
      const newUser: User = this.userRepository.create({ ...user, cart });

      return this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof BadRequestException) {
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
      return await this.userRepository.findOne({
        where: { userId },
      });
    } catch (error) {
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

  //   Crear metodo para cambiar la contraseña, eliminar usuario (soft delete).
}
