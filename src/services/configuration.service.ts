import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import 'reflect-metadata';

import { environment } from '../environments/environment';
import { IService } from './service';

export interface IConfigurationService extends IService {
  formatDate(rawDate: any): string;
  getPageUrl(): string;
  getSchnackDomain(): string;
  getSchnackHost(): string;
}

@injectable()
export class ConfigurationService implements IConfigurationService {

  public formatDate(rawDate: any): string {
    const m = moment.utc(rawDate);
    if (environment.dateFormat && environment.dateFormat !== '') {
      return m.format(environment.dateFormat);
    }
    return m.fromNow();
  }

  public getPageUrl(): string {
    return 'todo %SLUG%';
  }

  public getSchnackDomain(): string {
    const schnackHostName = environment.schnackHostName;

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

  public getSchnackHost(): string {
    const host = `${environment.schnackProtocol}://${environment.schnackHostName}`;
    return environment.schnackPort && environment.schnackPort !== 0 ?
      `${host}:${environment.schnackPort}` :
      host;
  }

  public async initialize(app: express.Application): Promise<any> {
    return Promise.resolve(1);
  }
}
