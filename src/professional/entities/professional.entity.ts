import { Availability } from 'src/availability/entities/availability.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Role } from 'src/common/enum/role.enum';
import { Profile } from 'src/profile/entities/profile.entity';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from 'typeorm';

@Entity()
export class Professional {
  @PrimaryColumn()
  professionalId: string;

  @Column()
  fullname: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  facebookURL: string;

  @Column({ nullable: true })
  youtubeURL: string;

  @Column({ nullable: true })
  instagramURL: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: Role, default: Role.ADMIN })
  role: Role;

  @OneToMany(() => Booking, (booking) => booking.professional, {
    onDelete: 'CASCADE',
  })
  booking: Booking[];

  @OneToMany(() => Availability, (availability) => availability.professional, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'availability' })
  availability: Availability[];

  @OneToOne(() => User, (user) => user.professional)
  user: User;

  @ManyToMany(() => Specialty, (specialty) => specialty.professional, {
    onDelete: 'CASCADE',
    eager: true,
  })
  specialty: Specialty[];

  @OneToOne(() => Profile, (profile) => profile.professional, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true,
  })
  profile: Profile;
}
