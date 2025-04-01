import { Plan } from 'src/plan/entities/plan.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PlanPurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'] })
  payment_status: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.planPurchase)
  @JoinColumn({ name: 'user' })
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.planPurchase)
  @JoinColumn({ name: 'plan' })
  plan: Plan;
}
