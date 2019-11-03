import { Container } from 'inversify';

import CONTROLLERTYPES from './controllers/controller.types';
import SERVICETYPES from './services/service.types';

/* tslint:disable ordered-imports */
// controllers
import { ICommentController, CommentController } from './controllers';
import { IHomeController, HomeController } from './controllers';
import { ISubscriptionController, SubscriptionController } from './controllers';
import { IUserController, UserController } from './controllers';
// services

import { IAuthorizationService, AuthorizationService } from './services';
import { ICommentService, CommentService } from './services';
import { IDatabaseService, DatabaseService } from './services';
import { IConfigurationService, ConfigurationService } from './services';
import { IRouteService, RouteService } from './services';
import { ISubscriptionService, SubscriptionService } from './services';
import { IUserService, UserService } from './services';
/* tslint:enable ordered-imports */

const container = new Container();

// controllers
container.bind<ICommentController>(CONTROLLERTYPES.CommentController).to(CommentController);
container.bind<IHomeController>(CONTROLLERTYPES.HomeController).to(HomeController);
container.bind<ISubscriptionController>(CONTROLLERTYPES.SubscriptionController).to(SubscriptionController);
container.bind<IUserController>(CONTROLLERTYPES.UserController).to(UserController);

// services
container.bind<IAuthorizationService>(SERVICETYPES.AuthorizationService).to(AuthorizationService).inSingletonScope();
container.bind<ICommentService>(SERVICETYPES.CommentService).to(CommentService);
container.bind<IDatabaseService>(SERVICETYPES.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<IConfigurationService>(SERVICETYPES.ConfigurationService).to(ConfigurationService).inSingletonScope();
container.bind<IRouteService>(SERVICETYPES.RouteService).to(RouteService).inSingletonScope();
container.bind<ISubscriptionService>(SERVICETYPES.SubscriptionService).to(SubscriptionService);
container.bind<IUserService>(SERVICETYPES.UserService).to(UserService);

export default container;
