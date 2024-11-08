import { Module } from '@nestjs/common';
import { ClientOrderService } from './client-order.service';
import { ClientOrderController } from './client-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientOrder } from './entities/client-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientOrder])],
  controllers: [ClientOrderController],
  providers: [ClientOrderService],
})
export class ClientOrderModule {}
