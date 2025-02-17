import {
  Injectable,
  BadGatewayException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import * as bcryptjs from 'bcryptjs';
import { User } from 'src/user/entity/user.entity';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly cartService: CartService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcryptjs.hash(registerDto.password, 10);

      const user = await this.userService.createUser({
        ...registerDto,
        password: hashedPassword,
      });

      // Creamos un carrito para este nuevo usuario
      await this.cartService.createCart(user);

      const SECRET_KEY: string = process.env.SECRET_KEY;

      if (!SECRET_KEY) {
        throw new Error('Secret key not found');
      }

      // Creamos un token de confirmacion que sera enviado por mail.
      const confirmationToken: string = await this.jwtService.signAsync(
        { email: registerDto.email },
        { expiresIn: '15m', secret: SECRET_KEY },
      );

      // Enviamos el mail de confirmacion junto al token.
      await this.mailService.sendConfirmationEmail(
        registerDto.email,
        confirmationToken,
      );

      return {
        message: 'Registered succesfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadGatewayException(
        'Error trying to register a new user',
        error.message,
      );
    }
  }

  async confirmEmail(token: string) {
    try {
      const SECRET_KEY = process.env.SECRET_KEY;

      if (!SECRET_KEY) {
        throw new Error('Secret key not found');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: SECRET_KEY,
      });
      const user = await this.userService.findUserByEmail(payload.email);

      if (!user) {
        throw new BadRequestException('Invalid token');
      }

      // Cambiamos el valor de isEmailConfirmed a true
      await this.userService.verifyUser(user.email);

      return {
        message:
          'Email confirmado exitosamente, seras redirigido a Nutricoaching...',
      };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const user: User = await this.userService.findUserByEmail(loginDto.email);

      const isValidPassword: boolean = await bcryptjs.compare(
        loginDto.password,
        user.password,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException(
          "Email / username and password doesn't match",
        );
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      if (!SECRET_KEY) {
        throw new UnauthorizedException('Secret key required');
      }

      const payload = {
        sub: user.userId,
        email: user.email,
      };

      const token = await this.jwtService.signAsync(payload, {
        secret: SECRET_KEY,
      });

      return { token };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadGatewayException(
        'Error trying to login user',
        error.message,
      );
    }
  }
}
