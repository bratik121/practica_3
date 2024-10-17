import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DirectoryEntity } from './directory.entity';

@Entity('directory_email')
export class DirectoryEmailEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column()
  email: string;

  @ManyToOne(() => DirectoryEntity)
  @JoinColumn({ name: 'id_directory' })
  directory: DirectoryEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @Column({ type: 'int' })
  id_directory: number;

  static create(email: string, id_directory: number): DirectoryEmailEntity {
    const directoryEmail = new DirectoryEmailEntity();
    directoryEmail.email = email;
    directoryEmail.id_directory = id_directory;
    return directoryEmail;
  }
}
