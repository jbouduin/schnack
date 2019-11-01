import { Container } from 'inversify';

import CONTROLLERTYPES from './controllers/controller.types';
import SERVICETYPES from './services/service.types';

/* tslint:disable ordered-imports */
// controllers
import { ICommentController, CommentController } from './controllers';
import { IHomeController, HomeController } from './controllers';

// services

import { IAuthorizationService, AuthorizationService } from './services';
import { ICommentService, CommentService } from './services';
import { IDatabaseService, DatabaseService } from './services';
import { IRouteService, RouteService } from './services';
import { IUserService, UserService } from './services';
/* tslint:enable ordered-imports */

const container = new Container();

// controllers
container.bind<ICommentController>(CONTROLLERTYPES.CommentController).to(CommentController);
container.bind<IHomeController>(CONTROLLERTYPES.HomeController).to(HomeController);

// services
container.bind<IAuthorizationService>(SERVICETYPES.AuthorizationService).to(AuthorizationService).inSingletonScope();
container.bind<ICommentService>(SERVICETYPES.CommentService).to(CommentService);
container.bind<IDatabaseService>(SERVICETYPES.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<IRouteService>(SERVICETYPES.RouteService).to(RouteService);
container.bind<IUserService>(SERVICETYPES.UserService).to(UserService);

export default container;
