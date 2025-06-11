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

  @ManyToOne(() => Cart, (cart) => cart.cartItems, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cart' })
  cart: Cart;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Viand, (viand) => viand.cartItem, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'viand' })
  viand?: Viand;

  @ManyToOne(() => Product, (product) => product.cartItem, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'product' })
  product?: Product;
}
