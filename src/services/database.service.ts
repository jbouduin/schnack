import { Application } from 'express';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { createConnection, Connection} from "typeorm";

import { Comment, User } from '../db/entities';
import { environment } from '../environments/environment';
import { IService } from './service';

export interface IDatabaseService extends IService { }

@injectable()
export class DatabaseService implements IDatabaseService {

  // fields
  connection: Connection;

  // interface members
  public initialize(app: Application): void {
    createConnection({
        type: 'sqlite',
        database: 'data.sqlite',
        entities: [Comment, User],
        synchronize: true,
      })
      .then(result => {
        this.connection = result;
      })
      .catch(error => console.log(error));
  }
}
