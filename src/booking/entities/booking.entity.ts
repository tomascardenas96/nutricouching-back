import { Professional } from 'src/professional/entities/professional.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  bookingId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column()
  interval: number;

  @Column()
  specialtyId: string;

  @ManyToOne(() => User, (user) => user.booking, { eager: true })
  @JoinColumn({ name: 'user' })
  user: User;

  @ManyToOne(() => Professional, (professional) => professional.booking, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'professional' })
  professional: Professional;
}
