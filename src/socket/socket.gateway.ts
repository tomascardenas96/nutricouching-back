import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
import { Server, Socket } from 'socket.io';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entities/notification.entity';

@WebSocketGateway({ cors: { origin: '*', credentials: true } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly notificationService: NotificationService,
  ) {}

  async handleConnection(client: Socket) {
    const userId: any = client.handshake.query.userId;

    if (!userId) {
      client.disconnect();
      return;
    }

    client.join(`user_${userId}`);
    console.log(`Client ${userId} connected to channel user_${userId} `);
  }

  notifyUserDeletedBooking(userId: string, notification: Notification) {
    this.server
      .to(`user_${userId}`)
      .emit(`deletedBookingNotify`, { ...notification });
  }

  handleDisconnect(client: Socket) {
    console.log(`client disconnected: `, client.id);
  }
}
