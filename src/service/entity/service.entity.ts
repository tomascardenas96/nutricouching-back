import { User } from 'src/user/entity/user.entity';
import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';

@Entity()
export class Service {
  @PrimaryColumn()
  serviceId: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  price: number;

  @ManyToMany(() => User, (user) => user.service)
  user: User[];
}
