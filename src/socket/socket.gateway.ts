import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Cart } from 'src/cart/entities/cart.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { SocketService } from './socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
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
  }

  notifyUserDeletedBooking(userId: string, notification: Notification) {
    this.server
      .to(`user_${userId}`)
      .emit(`deletedBookingNotify`, { ...notification });
  }

  notifyUserAfterPurchase(userId: string, notification: Notification) {
    this.server
      .to(`user_${userId}`)
      .emit(`afterPurchaseNotify`, { ...notification });
  }

  sendNewCart(userId: string, cart: Cart) {
    this.server.to(`user_${userId}`).emit(`sendNewCart`, { ...cart });
  }

  handleDisconnect(client: Socket) {
  }
}
