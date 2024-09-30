import { Professional } from 'src/professional/entities/professional.entity';
import { Service } from 'src/service/entity/service.entity';
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
  time: string;

  @ManyToOne(() => Service, (service) => service.booking)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @ManyToOne(() => User, (user) => user.booking)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Professional, (professional) => professional.booking)
  @JoinColumn({ name: 'professionalId' })
  professional: Professional;
}
