import { Days } from 'src/common/enum/days.enum';
import { Professional } from '../../professional/entities/professional.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  availabilityId: string;

  @ManyToOne(() => Professional, (professional) => professional.availability, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'professional' })
  professional: Professional;

  @Column({ type: 'enum', enum: Days })
  day: Days;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  interval: number;

  @Column()
  slotStart: string;

  @Column()
  slotEnd: string;
}
