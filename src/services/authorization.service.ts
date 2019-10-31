import { Application } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { IService } from './service';

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
  public initialize(app: Application): void {
    this.providers.push({ id: 'twitter', name: 'Twitter' });
    this.providers.push({ id: 'github', name: 'Github' });
    this.providers.push({ id: 'google', name: 'Google' });
    this.providers.push({ id: 'facebook', name: 'Facebook' });
    this.providers.push({ id: 'mastodon', name: 'Mastodon' });
  }

  public getProviders(): Array<IProvider> {
    return this.providers;
  }
}
