import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DirectoryEmailEntity } from './directory-email.entity';

@Entity('directory')
export class DirectoryEntity {
  @PrimaryGeneratedColumn(`increment`)
  id: number;

  @Column()
  name: string;

  @OneToMany(() => DirectoryEmailEntity, (email) => email.directory)
  directoryEmails: DirectoryEmailEntity[];

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

  static create(name: string): DirectoryEntity {
    const directory = new DirectoryEntity();
    directory.name = name;
    return directory;
  }
}
