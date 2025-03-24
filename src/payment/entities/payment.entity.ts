import { ClientOrder } from 'src/client-order/entities/client-order.entity';
import {
  Column,
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

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => ClientOrder, (clientOrder) => clientOrder.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clientOrder' })
  clientOrder: ClientOrder;
}
