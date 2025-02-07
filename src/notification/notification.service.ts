import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  /**
   * Metodo para crear una nueva notificacion
   *
   * @param userId - El ID del usuario
   * @param message - Mensaje de la notificacion
   * @returns - El objeto creado
   */
  async createNotification(
    userId: string,
    message: string,
  ): Promise<Notification> {
    try {
      const user = await this.userService.findUserById(userId);

      const notification = this.notificationRepository.create({
        user,
        message,
      });

      return this.notificationRepository.save(notification);
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadGatewayException('Error creating notification');
    }
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      return this.notificationRepository.find({
        where: { user: { userId } },
        order: { createdAt: 'ASC' },
      });
    } catch (error) {
      throw new BadGatewayException('Error getting notifications by user');
    }
  }

  /**
   * Metodo para marcar las notificaciones como leidas
   *
   * @param notificationsId - Arreglo con los identificadores de las notificaciones a marcar
   * @returns - Un mensaje con la cantidad de filas afectadas por el cambio, y un arreglo de tipo Notification (objetos modificados)
   */
  async markAsRead(
    notificationsId: string[],
  ): Promise<{ message: string; notifications?: Notification[] }> {
    try {
      const notifications = [];

      for (const notificationId of notificationsId) {
        const foundNotification = await this.notificationRepository.findOne({
          where: { isRead: false, notificationId },
        });

        if (foundNotification) {
          notifications.push(foundNotification);
        }
      }

      if (!notifications.length) {
        return { message: '0 files affected' };
      }

      let affected: number = 0;

      for (const notification of notifications) {
        if (notification.isRead === false) {
          notification.isRead = true;

          affected = affected + 1;
        }
      }

      await this.notificationRepository.save(notifications);

      return { message: `${affected} file(s) affected`, notifications };
    } catch (error) {
      throw new BadGatewayException('Error marking notification as read');
    }
  }
}
