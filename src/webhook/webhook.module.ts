import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { CartItemModule } from 'src/cart-item/cart-item.module';
import { ViandModule } from 'src/viand/viand.module';
import { ProductModule } from 'src/product/product.module';
import { PaymentModule } from 'src/payment/payment.module';
import { ClientOrderModule } from 'src/client-order/client-order.module';

@Module({
  imports: [
    CartItemModule,
    ViandModule,
    ProductModule,
    PaymentModule,
    ClientOrderModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
