import { Cart } from 'src/cart/entities/cart.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';

@Entity()
export class ClientOrder {
  @PrimaryGeneratedColumn('uuid')
  clientOrderId: string;

  @OneToOne(() => Cart, (cart) => cart.clientOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart' }) // Cambio a OneToOne si el carrito es único por orden
  cart: Cart;

  @Column()
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToMany(() => Payment, (payment) => payment.clientOrder, {
    onDelete: 'CASCADE',
  }) // Permite múltiples pagos
  payments: Payment[];

  @OneToMany(() => Invoice, (invoice) => invoice.order, { onDelete: 'CASCADE' })
  invoice: Invoice[];

  // Crear una entidad que guarde el historial de los productos actualmente en el carrito antes de ser eliminados por el webhook.
}
