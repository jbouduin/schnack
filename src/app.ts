import * as bodyParser from 'body-parser';
import { TypeormStore } from 'connect-typeorm';
import * as cors from 'cors';
import * as express from 'express';
import * as ExpressSession from 'express-session';
import { getRepository } from 'typeorm';

import { Session } from './db/entities';
import { environment } from './environments/environment';

import container from './inversify.config';
import {
  IAuthorizationService,
  IConfigurationService,
  IDatabaseService,
  IRouteService,
  IUserService } from './services';
import SERVICETYPES from './services/service.types';

class App {

  public app: express.Application;
  private configurationService: IConfigurationService;

  public constructor() {
    this.app = express();
    this.configurationService = container.get<IConfigurationService>(SERVICETYPES.ConfigurationService);
    container.get<IDatabaseService>(SERVICETYPES.DatabaseService)
      .initialize(this.app)
      .then(db => {
        this.config();
        container.get<IUserService>(SERVICETYPES.UserService).initialize(this.app);
        container.get<IAuthorizationService>(SERVICETYPES.AuthorizationService).initialize(this.app);
        container.get<IRouteService>(SERVICETYPES.RouteService).initialize(this.app);
      });
  }

  private config(): void {
    this.app.use(express.static('build'));
    // this.app.use(express.static('test'));
    this.app.use(cors(
      {
        credentials: true,
        origin: true // TODO legacy had 'checkorigin'
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
          secure: environment.schnackProtocol === 'https'
        },
        name: 'schnackie',
        resave: true,
        saveUninitialized: false,
        secret: 'authConfig.secret',
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

export default new App().app;
/*
const awaiting_moderation = [];

pushHandler.init(app, db, awaiting_moderation);
    // POST new comment
    app.post('/comments/:slug', (request, reply) => {
    if (!user) return error('access denied', request, reply, 403);

                    if (!user.blocked && !user.trusted) {
                        awaiting_moderation.push({ slug });
                    }
                    schnackEvents.emit('new-comment', {
                        user: user,
                        slug,
                        id: stmt.lastID,
                        comment,
                        replyTo

    });

*/
