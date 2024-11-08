import { CartItem } from 'src/cart-item/entities/Cart-item.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  cartId: string;

  @OneToOne(() => User, (user) => user)
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];
}
