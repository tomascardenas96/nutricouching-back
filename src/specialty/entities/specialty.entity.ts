import { Category } from 'src/category/entities/category.entity';
import { Professional } from 'src/professional/entities/professional.entity';
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

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

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

  @ManyToOne(() => Category, (category) => category.specialties, {
    eager: true,
  })
  @JoinColumn({ name: 'category' })
  category: Category;
}
