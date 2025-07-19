import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ProductModule } from './product/product.module';
import { ViandModule } from './viand/viand.module';
import { CartModule } from './cart/cart.module';
import { ServiceModule } from './service/service.module';
import { MailModule } from './mail/mail.module';
import { BookingModule } from './booking/booking.module';
import { ProfessionalModule } from './professional/professional.module';
import { AvailabilityModule } from './availability/availability.module';
import { ClientOrderModule } from './client-order/client-order.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { PaymentModule } from './payment/payment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SpecialtyModule } from './specialty/specialty.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { SocketModule } from './socket/socket.module';
import { NotificationModule } from './notification/notification.module';
import { MercadopagoModule } from './mercadopago/mercadopago.module';
import { WebhookModule } from './webhook/webhook.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PlanModule } from './plan/plan.module';
import { PlanPurchaseModule } from './plan_purchase/plan_purchase.module';
import { ProfileModule } from './profile/profile.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import 'dotenv/config'

console.log(process.env.DATABASE_URL)

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProductModule,
    ViandModule,
    CartModule,
    ServiceModule,
    MailModule,
    BookingModule,
    ProfessionalModule,
    AvailabilityModule,
    ClientOrderModule,
    CartItemModule,
    PaymentModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    SpecialtyModule,
    IngredientModule,
    SocketModule,
    NotificationModule,
    MercadopagoModule,
    WebhookModule,
    InvoiceModule,
    PlanModule,
    PlanPurchaseModule,
    ProfileModule,
    CategoryModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
