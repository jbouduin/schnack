import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";

import { Comment } from './comment';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'nvarchar',
    length: 128,
    nullable: false
  })
  name: string;

  @Column({
    type: 'nvarchar',
    length: 128,
    nullable: false
  })
  display_name: string

  @Column({
    type: 'nvarchar',
    length: 128,
    nullable: false
  })
  provider: string;

  @Column({
    type: 'nvarchar',
    length: 128,
    nullable: false
  })
  provider_id: string;

  @Column()
  blocked: boolean;

  @Column()
  trusted: boolean;

  @Column({
    type: 'nvarchar',
    length: 255,
    nullable: false
  })
  url: string

  @OneToMany(type => Comment, comment => comment.user)
  comments: Promise<Comment[]>;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  modified: Date;

  @VersionColumn()
  version: number;


}
