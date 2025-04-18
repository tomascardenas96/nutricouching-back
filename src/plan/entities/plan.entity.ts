import { PlanPurchase } from 'src/plan_purchase/entities/plan-pucharse.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  planId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  shortDescription: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  price: number;

  @Column()
  file_url: string;

  @Column({ default: false })
  isOffer: boolean;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => PlanPurchase, (planPurchase) => planPurchase.plan)
  planPurchase: PlanPurchase[];
}
