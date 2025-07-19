import { Plan } from 'src/plan/entities/plan.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
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

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.planPurchase, { eager: true })
  @JoinColumn({ name: 'user' })
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.planPurchase, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plan' })
  plan: Plan;
}
