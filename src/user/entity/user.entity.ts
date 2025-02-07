import { Booking } from 'src/booking/entities/booking.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Plan } from 'src/common/enum/plan.enum';
import { Role } from 'src/common/enum/role.enum';
import { Notification } from 'src/notification/entities/notification.entity';
import { Professional } from 'src/professional/entities/professional.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Plan, default: Plan.NO_PLAN })
  plan: Plan;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: null })
  deletedAt: Date;

  @Column({ nullable: true })
  confirmationToken: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @OneToMany(() => Booking, (booking) => booking.user)
  booking: Booking;

  @OneToOne(() => Professional, (professional) => professional.user, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'professional' })
  professional: Professional;

  @OneToOne(() => Cart, (cart) => cart.user, { eager: true })
  @JoinColumn({ name: 'cart' })
  cart: Cart;

  @OneToMany(() => Notification, (notification) => notification.user, {
    onDelete: 'CASCADE',
  })
  notifications: Notification[];
}
