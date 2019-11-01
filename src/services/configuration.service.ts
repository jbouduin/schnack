import * as express from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { environment } from '../environments/environment';
import { IService } from './service';

export interface IConfigurationService extends IService {
  getSchnackDomain(): string;
}

@injectable()
export class ConfigurationService implements IConfigurationService {

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

  public async initialize(app: express.Application): Promise<any> {
    return Promise.resolve(1);
  }
}
