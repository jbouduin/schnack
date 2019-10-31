import { Request, Response } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';

export interface ICommentController {
  approveComment(_request: Request, response: Response): void;
  rejectComment(_request: Request, response: Response): void;
  getComments(_request: Request, response: Response): void;
  postComment(_request: Request, response: Response): void;
}

@injectable()
export class CommentController implements ICommentController {

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
    console.log(`in getComments ${slug}`);
    response.sendStatus(500);
  }

  postComment(request: Request, response: Response): void {
    const slug = request.params['slug'];
    console.log(`in postComment ${slug}`);
    response.sendStatus(500);
  }
}
