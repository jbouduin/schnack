import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import 'reflect-metadata';

import { IAuthorizationService, ICommentService } from '../services';
import SERVICETYPES from '../services/service.types';

export interface ICommentController {
  approveComment(_request: Request, response: Response): void;
  rejectComment(_request: Request, response: Response): void;
  getComments(_request: Request, response: Response): void;
  postComment(_request: Request, response: Response): void;
}

@injectable()
export class CommentController implements ICommentController {

  // interface members
  approveComment(request: Request, response: Response): void  {
    const commentId = request.params['id'];
    console.log(`in approveComment ${commentId}`);
    response.sendStatus(500);
  }

  rejectComment(request: Request, response: Response): void  {
    const commentId = request.params['id'];
    console.log(`in rejectComment ${commentId}`);
    response.sendStatus(500);
  }

  getComments(request: Request, response: Response): void {
    const slug = request.params['slug'];
    this.commentService.getCommentsBySlug(slug, 1).then(comments =>
      response.send({
        user: null,
        auth: this.authorizationService.getProviders(),
        slug,
        comments: comments}));
  }

  postComment(request: Request, response: Response): void {
    const slug = request.params['slug'];
    console.log(`in postComment ${slug}`);
    response.sendStatus(500);
  }

  // constructor
  public constructor(
    @inject(SERVICETYPES.AuthorizationService) private authorizationService: IAuthorizationService,
    @inject(SERVICETYPES.CommentService) private commentService: ICommentService) { }
}
