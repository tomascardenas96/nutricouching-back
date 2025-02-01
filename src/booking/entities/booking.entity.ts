import { Professional } from 'src/professional/entities/professional.entity';
import { Service } from 'src/service/entities/service.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
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

  @ManyToOne(() => Service, (service) => service.booking, { eager: true })
  @JoinColumn({ name: 'service' })
  service: Service;

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
