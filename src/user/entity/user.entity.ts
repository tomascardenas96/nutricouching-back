import { Booking } from 'src/booking/entities/booking.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Plan } from 'src/common/enum/plan.enum';
import { Role } from 'src/common/enum/role.enum';
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

  @Column({ type: 'enum', enum: Role, default: Role.GUEST_USER })
  role: Role;

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
  })
  @JoinColumn({ name: 'professional' })
  professionl: Professional;

  @OneToOne(() => Cart, (cart) => cart.user)
  @JoinColumn({ name: 'cart' })
  cart: Cart;
}
