import { Application } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { createConnection} from 'typeorm';

import { Comment, Session, Subscription, User } from '../db/entities';
import { environment } from '../environments/environment';

import { IService } from './service';

export interface IDatabaseService extends IService { }

@injectable()
export class DatabaseService implements IDatabaseService {

  // interface members
  public async initialize(app: Application): Promise<any> {
    return createConnection({
        database: 'data.sqlite',
        entities: [Comment, Session, Subscription, User],
        synchronize: true,
        type: 'sqlite'
    });
  }
}
