import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";

import { User } from './user';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.comments, { nullable: false })
  user: User;

  @Column()
  reply_to: number;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false
  })
  slug: string;

  @Column({
    type: 'varchar',
    length: 4096,
    nullable: false
  })
  comment: string;

  @Column()
  rejected: boolean;

  @Column()
  approved: boolean;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  modified: Date;

  @VersionColumn()
  version: number;
}
