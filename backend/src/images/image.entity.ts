import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from '../clients/client.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  // Many-to-one relationship: many images belong to one client
  @ManyToOne(() => Client, (client) => client.images,  { onDelete: 'CASCADE' })

  // Custom foreign key column name
  @JoinColumn({ name: 'client_id' })

  client: Client;

  @Column()
  filename: string;

  @Column()
  mimetype: string;
}
