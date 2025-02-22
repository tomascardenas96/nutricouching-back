import { CartItem } from 'src/cart-item/entities/Cart-item.entity';
import { Ingredient } from 'src/ingredient/entities/ingredient.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Viand {
  @PrimaryGeneratedColumn('uuid')
  viandId: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.viand)
  cartItem: CartItem[];

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column()
  description: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    default:
      'https://www.syncros.com/_ui/responsive/common/images/no-product-image-available.png',
    nullable: true,
  })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.viands, {
    onDelete: 'CASCADE',
    eager: true,
  })
  ingredients: Ingredient[];
}
