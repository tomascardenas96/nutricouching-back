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

  @Column({ default: null })
  picture: string;

  @Column({ default: null })
  coverPhoto: string;

  @Column({ default: null })
  bio: string;

  @OneToOne(() => Professional, (professional) => professional, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'professional' })
  professional: Professional;

  @OneToMany(() => Post, (post) => post.profile)
  posts: Post[];
}
