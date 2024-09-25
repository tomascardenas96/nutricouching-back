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

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nutricoaching',
      entities: [join(__dirname, '/**/*.entity{.js,.ts}')],
      synchronize: true,
    }),
    ProductModule,
    ViandModule,
    CartModule,
    ServiceModule,
    MailModule,
    BookingModule,
    ProfessionalModule,
    AvailabilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
