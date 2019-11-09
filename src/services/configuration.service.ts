import * as express from 'express';
import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import * as path from 'path';
import 'reflect-metadata';

import { Application, Configuration, Environment } from '../configuration';
import { IService } from './service';

export interface IConfigurationService extends IService {
  application: Application;
  environment: Environment;
  formatDate(rawDate: any): string;
  getPageUrl(): string;
  getSchnackDomain(): string;
  getSchnackUrl(): string;
}

@injectable()
export class ConfigurationService implements IConfigurationService {

  // public properties
  public application: Application;
  public environment: Environment;

  private configuration: Configuration;
  public formatDate(rawDate: any): string {
    const m = moment.utc(rawDate);
    if (this.application.dateFormat && this.application.dateFormat !== '') {
      return m.format(this.application.dateFormat);
    }
    return m.fromNow();
  }

  public getPageUrl(): string {
    return 'todo %SLUG%';
  }

  public getSchnackDomain(): string {
    const schnackHostName = this.environment.server.hostname;

    if (schnackHostName === 'localhost') {
      return schnackHostName;
    }

    try {
      return schnackHostName
        .split('.')
        .slice(1)
        .join('.');
    } catch (error) {
      console.error(
        `The schnackHostName value "${schnackHostName}" doesn't appear to be a valid hostname`
      );
      process.exit(-1);
    }
  }

  public getSchnackUrl(): string {
    const host = `${this.environment.server.protocol}://${this.environment.server.hostname}`;
    return this.environment.server.port && this.environment.server.port !== 0 ?
      `${host}:${this.environment.server.port}` :
      host;
  }

  public async initialize(app: express.Application): Promise<any> {
    this.configuration = await Configuration.loadConfiguration();
    this.environment = this.configuration.current;
    this.application = this.configuration.application;
    return Promise.resolve(this.configuration);
  }

  // private helper methods
}
