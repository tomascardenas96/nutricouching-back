import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { Service } from 'src/service/entities/service.entity';
import { Viand } from 'src/viand/entities/viand.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  cartItemId: string;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn({ name: 'cart' })
  cart: Cart;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Service, (service) => service.cartItem)
  @JoinColumn({ name: 'service' })
  service?: Service;

  @ManyToOne(() => Viand, (viand) => viand.cartItem)
  @JoinColumn({ name: 'viand' })
  viand?: Viand;

  @ManyToOne(() => Product, (product) => product.cartItem)
  @JoinColumn({ name: 'product' })
  product?: Product;
}
