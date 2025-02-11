import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('filter')
  getNonProfessionalsUsersByEmail(@Query('email') email: string) {
    return this.userService.getNonProfessionalsUsersByEmail(email);
  }
}
