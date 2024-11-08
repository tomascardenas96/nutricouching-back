import { ClientOrder } from 'src/client-order/entities/client-order.entity';
import { StatusPayment } from 'src/common/enum/status-payment.enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  paymentId: string;

  @Column({ type: 'enum', enum: StatusPayment })
  status: StatusPayment;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => ClientOrder, (clientOrder) => clientOrder.payment)
  @JoinColumn({ name: 'clientOrder' })
  clientOrder: ClientOrder;

  @Column()
  total: number;
}
