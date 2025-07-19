import { ClientOrder } from 'src/client-order/entities/client-order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  invoiceId: string;

  @Column()
  itemId: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ClientOrder, (clientOrder) => clientOrder.invoice, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order' })
  order: ClientOrder;
}
