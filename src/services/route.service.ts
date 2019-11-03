import * as express from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { ICommentController, IHomeController, IUserController } from '../controllers';
import CONTROLLERTYPES from '../controllers/controller.types';

import { IService } from './service';

export interface IRouteService extends IService { }

@injectable()
export class RouteService implements IRouteService {

  // constructor
  public constructor(
    @inject(CONTROLLERTYPES.CommentController) private commentController: ICommentController,
    @inject(CONTROLLERTYPES.HomeController) private homeController: IHomeController,
    @inject(CONTROLLERTYPES.UserController) private userController: IUserController
  ) { }

  // interface members
  public async initialize(app: express.Application): Promise<any> {
    const router = express.Router();
    router.all(
      '/hello',
      (request: express.Request, response: express.Response) => {
        this.homeController.helloWorld(request, response);
      });

    router.get(
      '/comments/:slug',
      (request: express.Request, response: express.Response) => {
        this.commentController.getComments(request, response);
      });

    router.post(
      '/comments/:slug',
      (request: express.Request, response: express.Response) => {
        this.commentController.postComment(request, response);
      });

    router.post(
      '/comment/:id/approve',
      (request: express.Request, response: express.Response) => {
        this.commentController.approveComment(request, response);
      });

    router.post(
      '/comment/:id/reject',
      (request: express.Request, response: express.Response) => {
          this.commentController.rejectComment(request, response);
      });

      app.post(
        '/markdown',
        (request: express.Request, response: express.Response) => {
          this.commentController.markdown2Html(request, response);
      });

    router.post(
      '/user/:id/block',
      (request: express.Request, response: express.Response) => {
          this.userController.blockUser(request, response);
      });

    router.post(
      '/user/:id/trust',
      (request: express.Request, response: express.Response) => {
          this.userController.trustUser(request, response);
      });

    // TODO post /user/:id/unblock
    // TODO post /user/:id/untrust
    // TODO post /user/:id/grantadmin
    // TODO post /user/:id/revokeadmin
    app.use(router);

    return Promise.resolve(true);
  }
}
