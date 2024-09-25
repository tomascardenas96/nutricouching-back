import { Exclude } from 'class-transformer';
import { Booking } from 'src/booking/entities/booking.entity';
import { Plan } from 'src/common/enum/plan.enum';
import { Role } from 'src/common/enum/role.enum';
import { Service } from 'src/service/entity/service.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  userId: string;
  // Generamos un randomUUID desde la logica.

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
}
