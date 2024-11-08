import { Booking } from 'src/booking/entities/booking.entity';
import { CartItem } from 'src/cart-item/entities/Cart-item.entity';
import { Professional } from 'src/professional/entities/professional.entity';
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

  @ManyToMany(() => Professional, (professional) => professional.service)
  @JoinTable({
    name: 'professional-by-service',
    joinColumn: {
      name: 'service',
      referencedColumnName: 'serviceId',
    },
    inverseJoinColumn: {
      name: 'professional',
      referencedColumnName: 'professionalId',
    },
  })
  professional: Professional[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.service)
  cartItem: CartItem[];
}
