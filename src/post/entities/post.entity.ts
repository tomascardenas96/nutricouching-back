import { Profile } from 'src/profile/entities/profile.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  postId: string;

  @Column({ type: 'mediumtext' })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.posts)
  @JoinColumn({ name: 'profile' })
  profile: Profile;
}
