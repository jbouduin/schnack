import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

import { User } from './user';

// TODO until we find the time to change this
/* tslint:disable variable-name */
@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => User, user => user.comments, { nullable: false })
  public user: User;

  @Column()
  public reply_to: number;

  @Column('nvarchar', { length: 128, nullable: false })
  public slug: string;

  @Column('nvarchar', { length: 4096, nullable: false })
  public comment: string;

  @Column()
  public rejected: boolean;

  @Column()
  public approved: boolean;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public modified: Date;

  @VersionColumn()
  public version: number;
}
