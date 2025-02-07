import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Patch()
  markAsRead(@Body() notificationId: string[]) {
    return this.notificationService.markAsRead(notificationId);
  }
}
