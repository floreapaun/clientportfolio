import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Image } from '../images/image.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  // One-to-many relationship: one client has many images
  @OneToMany(() => Image, (image) => image.client)
  images: Image[];

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  description: string;

  @Column({ length: 255 })
  link: string;

  @Column({ length: 50 })
  status: string;
}

