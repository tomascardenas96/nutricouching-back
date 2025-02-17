import { Module } from '@nestjs/common';
import { ClientOrderService } from './client-order.service';
import { ClientOrderController } from './client-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientOrder } from './entities/client-order.entity';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClientOrder]), CartModule],
  controllers: [ClientOrderController],
  providers: [ClientOrderService],
  exports: [ClientOrderService]
})
export class ClientOrderModule {}
