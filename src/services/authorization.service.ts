import { Application } from 'express';
import * as ExpressSession from "express-session";
import { injectable } from 'inversify';
import { getRepository } from "typeorm";
import { TypeormStore } from "connect-typeorm";
import { Session } from "../db/entities";

import { IService } from './service';

import 'reflect-metadata';
export interface IProvider {
  id: string;
  name: string
}

export interface IAuthorizationService extends IService {
  getProviders(): Array<IProvider>;
}

@injectable()
export class AuthorizationService implements IAuthorizationService {

  // fields
  private providers = new Array<IProvider>();

  // interface members
  public async initialize(app: Application): Promise<any> {
    const sessionRepository = getRepository(Session);
    app.use(ExpressSession({
        resave: false,
        saveUninitialized: false,
        secret: 'authConfig.secret',
        cookie: { secure: true, domain: 'todo' },
        store: new TypeormStore({
          cleanupLimit: 2,
          limitSubquery: false, // If using MariaDB.
          ttl: 86400
        }).connect(sessionRepository),
    }))
    this.providers.push({ id: 'twitter', name: 'Twitter' });
    this.providers.push({ id: 'github', name: 'Github' });
    this.providers.push({ id: 'google', name: 'Google' });
    this.providers.push({ id: 'facebook', name: 'Facebook' });
    this.providers.push({ id: 'instagram', name: 'Instagram' });
    this.providers.push({ id: 'linkedin', name: 'LinkedIn' });
    this.providers.push({ id: 'mastodon', name: 'Mastodon' });
    return Promise.resolve(this.providers);
  }

  public getProviders(): Array<IProvider> {
    return this.providers;
  }
}
