import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryColumn('nvarchar', { length: 600, nullable: false })
  public endpoint: string;

  @Column('nvarchar', { length: 4096, nullable: false })
  public publicKey: string;

  @Column('nvarchar', { length: 600, nullable: false })
  public auth: string;
}
