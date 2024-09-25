import { Professional } from 'src/professional/entities/professional.entity';
import { Service } from 'src/service/entity/service.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Booking {
  @PrimaryColumn()
  bookingId: string;

  @Column()
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @ManyToOne(() => Service, (service) => service)
  @JoinColumn({ name: 'service' })
  service: Service;

  @ManyToOne(() => User, (user) => user.booking)
  @JoinColumn({ name: 'user' })
  user: User;

  @ManyToOne(() => Professional, (professional) => professional.booking)
  @JoinColumn({ name: 'professional' })
  professional: Professional;
}
