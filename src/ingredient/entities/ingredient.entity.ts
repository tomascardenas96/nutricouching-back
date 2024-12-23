import { Viand } from 'src/viand/entities/viand.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  ingredientId: string;

  @Column()
  name: string;

  @ManyToMany(() => Viand, (viand) => viand.ingredients, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'viand_ingredients',
    joinColumn: { name: 'ingredientId', referencedColumnName: 'ingredientId' },
    inverseJoinColumn: { name: 'viandId', referencedColumnName: 'viandId' },
  })
  viands: Viand[];
}
