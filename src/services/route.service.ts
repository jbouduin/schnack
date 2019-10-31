import { Application, Request, Response } from 'express';
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
  public initialize(app: Application): void {

    app.route('/hello')
      .all((request: Request, response: Response) => {
        this.homeController.helloWorld(request, response);
      });

    app.route('/comments/:slug')
      .get((request: Request, response: Response) => {
        this.commentController.getComments(request, response);
      })
      .post((request: Request, response: Response) => {
        this.commentController.postComment(request, response);
      });

    app.route('/comment/:id/approve')
      .post((request: Request, response: Response) => {
        this.commentController.approveComment(request, response);
      });

    app.route('/comment/:id/reject')
      .post((request: Request, response: Response) => {
          this.commentController.rejectComment(request, response);
      });

    app.route('*')
      .all((request: Request, response: Response) => {
        response.sendStatus(404);
      });
  }

  // constructor
  public constructor(
    @inject(CONTROLLERTYPES.CommentController) private commentController: ICommentController,
    @inject(CONTROLLERTYPES.HomeController) private homeController: IHomeController
  ) { }
}
