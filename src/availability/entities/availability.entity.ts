import { Days } from 'src/common/enum/days.enum';
import { Professional } from '../../professional/entities/professional.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Availability {
  @PrimaryColumn()
  availabilityId: string;

  @ManyToOne(() => Professional, (professional) => professional.availability)
  @JoinColumn({ name: 'professional' })
  professional: Professional;

  @Column({ type: 'enum', enum: Days })
  day: Days;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
}
