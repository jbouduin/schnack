import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

import { Comment } from './comment';

// TODO until we find the time to change this
/* tslint:disable variable-name */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('nvarchar', { length: 128, nullable: false })
  public name: string;

  @Column('nvarchar', { length: 128, nullable: false })
  public display_name: string;

  @Column('nvarchar', { length: 128, nullable: false })
  public provider: string;

  @Column('nvarchar', { length: 128, nullable: false })
  public provider_id: string;

  @Column({ default: false })
  public administrator: boolean;

  @Column({ default: false })
  public blocked: boolean;

  @Column({ default: false })
  public trusted: boolean;

  @Column('nvarchar', { length: 255, nullable: true })
  public url: string;

  @OneToMany(type => Comment, comment => comment.user)
  public comments: Promise<Array<Comment>>;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public modified: Date;

  @VersionColumn()
  public version: number;
}
