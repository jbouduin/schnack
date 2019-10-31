import { Application } from 'express';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { createConnection, Connection} from "typeorm";

import { Comment, Session, User } from '../db/entities';
import { environment } from '../environments/environment';
import { IService } from './service';

export interface IDatabaseService extends IService { }

@injectable()
export class DatabaseService implements IDatabaseService {

  // fields
  connection: Connection;

  // interface members
  public async initialize(app: Application): Promise<any> {
    return createConnection({
        type: 'sqlite',
        database: 'data.sqlite',
        entities: [Comment, Session, User],
        synchronize: true,
    });
  }
}
