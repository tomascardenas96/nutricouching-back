import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { CartItemModule } from 'src/cart-item/cart-item.module';
import { ViandModule } from 'src/viand/viand.module';
import { ProductModule } from 'src/product/product.module';
import { PaymentModule } from 'src/payment/payment.module';
import { ClientOrderModule } from 'src/client-order/client-order.module';
import { CartModule } from 'src/cart/cart.module';
import { NotificationModule } from 'src/notification/notification.module';
import { SocketModule } from 'src/socket/socket.module';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { UserModule } from 'src/user/user.module';
import { PlanModule } from 'src/plan/plan.module';
import { PlanPurchaseModule } from 'src/plan_purchase/plan_purchase.module';

@Module({
  imports: [
    CartItemModule,
    ViandModule,
    ProductModule,
    PaymentModule,
    ClientOrderModule,
    CartModule,
    NotificationModule,
    SocketModule,
    InvoiceModule,
    UserModule,
    PlanModule,
    PlanPurchaseModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
