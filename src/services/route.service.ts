import * as express from 'express';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';

import { IService } from './service';
import CONTROLLERTYPES from '../controllers/controller.types';

import { IHomeController } from 'controllers';
import { ICommentController } from 'controllers';


export interface IRouteService extends IService {
}

@injectable()
export class RouteService implements IRouteService {

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

    app.use(router);

    return Promise.resolve(true);
  }

  // constructor
  public constructor(
    @inject(CONTROLLERTYPES.CommentController) private commentController: ICommentController,
    @inject(CONTROLLERTYPES.HomeController) private homeController: IHomeController
  ) { }
}
