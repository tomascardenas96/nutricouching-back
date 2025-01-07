import { Booking } from 'src/booking/entities/booking.entity';
import { CartItem } from 'src/cart-item/entities/Cart-item.entity';
import { Professional } from 'src/professional/entities/professional.entity';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Service {
  @PrimaryColumn()
  serviceId: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  price: number;

  @Column()
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Booking, (booking) => booking.service)
  booking: Booking;

  @OneToMany(() => CartItem, (cartItem) => cartItem.service)
  cartItem: CartItem[];

  @OneToMany(() => Specialty, (specialty) => specialty.service, {
    onDelete: 'CASCADE',
  })
  specialty: Specialty[];
}
