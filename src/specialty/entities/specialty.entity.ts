import { Professional } from 'src/professional/entities/professional.entity';
import { Service } from 'src/service/entities/service.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Specialty {
  @PrimaryGeneratedColumn('uuid')
  specialtyId: string;

  @Column()
  name: string;

  @ManyToOne(() => Service, (service) => service.specialty, { eager: true })
  @JoinColumn({ name: 'service' })
  service: Service;

  @ManyToMany(() => Professional, (professional) => professional.specialty, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'professional_specialty',
    joinColumn: {
      name: 'specialty',
      referencedColumnName: 'specialtyId',
    },
    inverseJoinColumn: {
      name: 'professional',
      referencedColumnName: 'professionalId',
    },
  })
  professional: Professional[];
}