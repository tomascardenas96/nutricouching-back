import { PlanPurchase } from 'src/plan_purchase/entities/plan-pucharse.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PlanPurchase, (planPurchase) => planPurchase.plan, {
    onDelete: 'CASCADE',
  })
  planPurchase: PlanPurchase[];
}
