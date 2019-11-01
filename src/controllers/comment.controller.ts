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

    // TODO legacy: admin has a separate query, viewing more
    // TODO legacy:
    // comments.forEach(c => {
    //     const m = moment.utc(c.created_at);
    //     c.created_at_s = date_format ? m.format(date_format) : m.fromNow();
    //     c.comment = marked(c.comment.trim());
    //     c.author_url = auth.getAuthorUrl(c);
    // });
    this.commentService.getCommentsBySlug(slug, 1).then(comments =>
      response.send(
        {
          auth: request.session.passport.user ?
            null :
            this.authorizationService.getProviders(),
          comments,
          slug,
          user: request.session.passport.user
        }
      )
    );
  }

  public postComment(request: Request, response: Response): void {
    if (!request.isAuthenticated()) {
      response.sendStatus(401);
    }
    // TODO Legacy: checkValidComment(db, slug, user.id, comment, replyTo, err => {

    this.commentService
      .createComment(
        request.session.passport.user,
        request.body.reply_to,
        request.params.slug,
        request.body.comment
      )
      .then(result => response.send({ status: 'ok', id: result.id }))
      .catch(err => {
        console.log(err);
        response.sendStatus(500);
      });
  }
}
