import { Booking } from 'src/booking/entities/booking.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Plan } from 'src/common/enum/plan.enum';
import { Notification } from 'src/notification/entities/notification.entity';
import { PlanPurchase } from 'src/plan_purchase/entities/plan-pucharse.entity';
import { Professional } from 'src/professional/entities/professional.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Plan, default: Plan.NO_PLAN })
  plan: Plan;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
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

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Notification, (notification) => notification.user, {
    onDelete: 'CASCADE',
  })
  notifications: Notification[];

  @OneToMany(() => PlanPurchase, (planPurchase) => planPurchase.user)
  planPurchase: PlanPurchase[];
}
