import { Availability } from 'src/availability/entities/availability.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Service } from 'src/service/entities/service.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Professional {
  @PrimaryColumn()
  professionalId: string;

  @Column()
  fullname: string;

  @Column()
  specialty: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  facebookURL: string;

  @Column({ nullable: true })
  youtubeURL: string;

  @Column({ nullable: true })
  instagramURL: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @ManyToMany(() => Service, (service) => service.professional)
  service: Service[];

  @OneToMany(() => Booking, (booking) => booking.professional)
  booking: Booking[];

  @OneToMany(() => Availability, (availability) => availability.professional)
  availability: Availability[];

  @OneToOne(() => User, (user) => user.professionl)
  user: User;
}
