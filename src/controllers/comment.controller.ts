import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { IAuthorizationService, ICommentService } from '../services';
import SERVICETYPES from '../services/service.types';

export interface ICommentController {
  approveComment(request: Request, response: Response): void;
  rejectComment(request: Request, response: Response): void;
  getComments(request: Request, response: Response): void;
  postComment(request: Request, response: Response): void;
}

@injectable()
export class CommentController implements ICommentController {
  // constructor
  public constructor(
    @inject(SERVICETYPES.AuthorizationService) private authorizationService: IAuthorizationService,
    @inject(SERVICETYPES.CommentService) private commentService: ICommentService) { }

  // interface members
  public approveComment(request: Request, response: Response): void  {
    const commentId = request.params.id;
    console.log(`in approveComment ${commentId}`);
    response.sendStatus(500);
  }

  public rejectComment(request: Request, response: Response): void  {
    const commentId = request.params.id;
    console.log(`in rejectComment ${commentId}`);
    response.sendStatus(500);
  }

  public getComments(request: Request, response: Response): void {
    const slug = request.params.slug;
    this.commentService.getCommentsBySlug(slug, 1).then(comments =>
      response.send(
        {
          auth: this.authorizationService.getProviders(),
          comments,
          slug,
          user: null
        }
      )
    );
  }

  public postComment(request: Request, response: Response): void {
    const slug = request.params.slug;
    console.log(`in postComment ${slug}`);
    response.sendStatus(500);
  }
}
