import { CartItem } from 'src/cart-item/entities/Cart-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
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
  })
  image: string;

  @Column({ default: true })
  isActive: boolean;
}
