import { Specialty } from 'src/specialty/entities/specialty.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Specialty, (specialty) => specialty.category)
  specialties: Specialty[];
}
