import { Post } from 'src/post/entities/post.entity';
import { Professional } from 'src/professional/entities/professional.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  profileId: string;

  @Column({ unique: true })
  profileName: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  coverPhoto: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  x: string;

  @Column({ nullable: true })
  tiktok: string;

  @OneToOne(() => Professional, (professional) => professional, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'professional' })
  professional: Professional;

  @OneToMany(() => Post, (post) => post.profile)
  posts: Post[];
}
