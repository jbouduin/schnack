import { EventEmitter } from 'events';
import * as express from 'express';

import { inject, injectable } from 'inversify';

import { EventType, IEvent } from '../events';
import { ISendMailConsumer, ISlackConsumer, IWriteLogConsumer } from '../events/consumers';

import { IConfigurationService} from './configuration.service';
import { IService } from './service';

import CONSUMERTYPES from '../events/consumers/consumer.types';
import SERVICETYPES from './service.types';

export interface IEventService extends IService {
  postEvent(event: IEvent): void;
 }

@injectable()
export class EventService implements IEventService {

  private emitter: EventEmitter;

  // constructor
  public constructor(
    @inject(CONSUMERTYPES.WriteLogConsumer) private writeLogConsumer: IWriteLogConsumer,
    @inject(SERVICETYPES.ConfigurationService) private configurationService: IConfigurationService) { }

  // interface members
  public async initialize(app: express.Application): Promise<any> {
    this.emitter = new EventEmitter();
    this.writeLogConsumer.registerConsumers().forEach(consumer => this.emitter.on(consumer[0], consumer[1]));
    return Promise.resolve(true);
  }

  public postEvent(event: IEvent): void {
    this.emitter.emit(event.getEventType(), event.getData());
  }
}
