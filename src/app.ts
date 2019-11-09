import * as bodyParser from 'body-parser';
import { TypeormStore } from 'connect-typeorm';
import * as cors from 'cors';
import * as express from 'express';
import * as ExpressSession from 'express-session';
import { getRepository } from 'typeorm';

import { Session } from './db/entities';

import container from './inversify.config';
import {
  IAuthenticationService,
  IConfigurationService,
  IDatabaseService,
  IEventService,
  IRouteService,
  IUserService } from './services';
import SERVICETYPES from './services/service.types';

class App {

  public app: express.Application;
  private configurationService: IConfigurationService;

  public constructor() {
    this.app = express();
  }

  public async initialize(): Promise<App> {
    this.configurationService = container.get<IConfigurationService>(SERVICETYPES.ConfigurationService);
    return this.configurationService.initialize(this.app)
      .then( configuration => {
        const eventService = container.get<IEventService>(SERVICETYPES.EventService);
        eventService.initialize(this.app);
        return container.get<IDatabaseService>(SERVICETYPES.DatabaseService)
          .initialize(this.app)
          .then(db => {
            this.config();
            return Promise.all([
              container.get<IUserService>(SERVICETYPES.UserService).initialize(this.app),
              container.get<IAuthenticationService>(SERVICETYPES.AuthenticationService).initialize(this.app)
            ]);
          })
          .then(all => container.get<IRouteService>(SERVICETYPES.RouteService).initialize(this.app))
          .then(router => Promise.resolve(this));
      })
      .catch(err => { throw err; });
  }

  public start(): void {
    const port = this.configurationService.environment.server.port;
    this.app.listen(port, () => {
        console.log(new Date() + `Express server listening on port ${port}`);
      });
  }

  private config(): void {
    this.configurationService.environment.server.serveStatic
      .forEach(value => this.app.use(express.static(value)));
    this.app.use(cors(
      {
        credentials: true,
        origin: true
      })
    );

    // support application/json type post data
    this.app.use(bodyParser.json());
    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));

    const sessionRepository = getRepository(Session);
    this.app.use(ExpressSession(
      {
        cookie: {
          domain: this.configurationService.getSchnackDomain(),
          secure: this.configurationService.environment.server.protocol === 'https'
        },
        name: 'schnackie',
        resave: true,
        saveUninitialized: false,
        secret: this.configurationService.application.secret,
        store: new TypeormStore(
          {
            cleanupLimit: 2,
            limitSubquery: false, // If using MariaDB.
            ttl: 86400
          }
        ).connect(sessionRepository)
     }
    ));
  }
}

export default new App();
/*
const awaiting_moderation = [];
*/
