import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/Cart-item.entity';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { CartModule } from 'src/cart/cart.module';
import { ViandModule } from 'src/viand/viand.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem]),
    ProductModule,
    CartModule,
    ViandModule,
  ],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
