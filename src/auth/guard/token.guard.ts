import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.getTokenFromHeaders(request);
    if (!token) {
      throw new UnauthorizedException('You need a token to get access');
    }

    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
      throw new UnauthorizedException('Secret key required');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: SECRET_KEY,
      });

      const user: User = await this.userService.findUserById(payload.sub);

      request['user'] = user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Token guard error');
    }

    return true;
  }

  private getTokenFromHeaders(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
