import { Application } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { DeleteResult, getRepository } from 'typeorm';

import { Subscription } from '../db/entities';

import { IService } from './service';

export interface ISubscriptionService extends IService {
  subscribe(endpoint: string, publicKey: string, auth: string): Promise<Subscription>;
  unsubscribe(endpoint: string): Promise<DeleteResult>;
}

@injectable()
export class SubscriptionService implements ISubscriptionService {

  public async initialize(app: Application): Promise<any> {
    return Promise.resolve(true);
  }

  public async subscribe(endpoint: string, publicKey: string, auth: string): Promise<Subscription> {

    const subscriptionRepository = getRepository(Subscription);
    const newSubscription = await subscriptionRepository.create(
      {
        auth,
        endpoint,
        publicKey
      }
    );
    return subscriptionRepository.save(newSubscription);
  }

  public async unsubscribe(endpoint: string): Promise<DeleteResult> {
    const subscriptionRepository = getRepository(Subscription);
    return subscriptionRepository.delete(endpoint);
  }
}
