import { PlanPurchase } from 'src/plan_purchase/entities/plan-pucharse.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  planId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  file_url: string;

  @Column({ default: false })
  isOffer: boolean;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => PlanPurchase, (planPurchase) => planPurchase.plan)
  planPurchase: PlanPurchase[];
}
