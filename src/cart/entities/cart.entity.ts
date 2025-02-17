import { CartItem } from 'src/cart-item/entities/Cart-item.entity';
import { ClientOrder } from 'src/client-order/entities/client-order.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  cartId: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.cart, {
    onDelete: 'CASCADE',

    eager: true,
  })
  @JoinColumn({ name: 'user' })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    onDelete: 'CASCADE',
  })
  cartItems: CartItem[];

  @OneToOne(() => ClientOrder, (clientOrder) => clientOrder.cart, {
    onDelete: 'CASCADE',
  })
  clientOrder: ClientOrder;
}
