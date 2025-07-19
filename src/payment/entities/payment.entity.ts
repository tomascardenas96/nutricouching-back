import { ClientOrder } from 'src/client-order/entities/client-order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  paymentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ClientOrder, (clientOrder) => clientOrder.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clientOrder' })
  clientOrder: ClientOrder;
}
