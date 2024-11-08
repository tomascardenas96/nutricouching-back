import { Cart } from 'src/cart/entities/cart.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ClientOrder {
  @PrimaryGeneratedColumn('uuid')
  clientOrderId: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user' })
  user: User;

  @ManyToOne(() => Cart, (cart) => cart)
  @JoinColumn({ name: 'cart' })
  cart: Cart;

  @Column()
  total: number;

  @OneToOne(() => Payment, (payment) => payment.clientOrder)
  payment: Payment;
}
