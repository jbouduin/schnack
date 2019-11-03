import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import * as marked from 'marked';
import 'reflect-metadata';
import * as rss from 'rss';

import { IAuthorizationService, ICommentService, IConfigurationService } from '../services';
import SERVICETYPES from '../services/service.types';
import { TrfComment, TrfUser } from '../transfer';

export interface ICommentController {
  approveComment(request: Request, response: Response): void;
  getComments(request: Request, response: Response): void;
  getRssFeedForModeration(request: Request, response: Response): void;
  markdown2Html(request: Request, response: Response): void;
  postComment(request: Request, response: Response): void;
  rejectComment(request: Request, response: Response): void;

}

@injectable()
export class CommentController implements ICommentController {
  // constructor
  public constructor(
    @inject(SERVICETYPES.AuthorizationService) private authorizationService: IAuthorizationService,
    @inject(SERVICETYPES.ConfigurationService) private configurationService: IConfigurationService,
    @inject(SERVICETYPES.CommentService) private commentService: ICommentService) {
    marked.setOptions({ sanitize: true });
  }

  // interface members
  public approveComment(request: Request, response: Response): void  {
    if (!request.isAuthenticated()) {
      response.sendStatus(401);
    } else {
      if (!request.session.passport.user.administrator) {
        response.sendStatus(403);
      } else {
        const commentId = Number(request.params.id);
        if (isNaN(commentId)) {
          response.sendStatus(400);
        } else {
          this.commentService
            .approveComment(commentId)
            .then(comment => response.send({ status: 'ok' }))
            .catch(err => {
              console.log(err);
              response.sendStatus(500);
            });
        }
      }
    }
  }

  public getComments(request: Request, response: Response): void {
    const slug = request.params.slug;

    let trfUser: TrfUser = null;
    if (request.session && request.session.passport && request.session.passport.user) {
      trfUser = new TrfUser();
      trfUser.name = request.session.passport.user.display_name || request.session.passport.user.name;
      trfUser.administrator = request.session.passport.user.administrator;
    }

    this.commentService
      .getCommentsBySlug(slug, 1, trfUser && trfUser.administrator)
      .then(comments => {
        const trfComments = comments.map(comment => {
          const trfComment = new TrfComment();
          trfComment.id = comment.id;
          trfComment.replyTo = comment.reply_to;
          trfComment.approved = comment.approved;
          trfComment.author = comment.user.display_name || comment.user.name;
          trfComment.authorUrl = comment.user.url;
          trfComment.comment = marked(comment.comment.trim());
          trfComment.created = this.configurationService.formatDate(comment.created);
          if (trfUser && trfUser.administrator) {
            trfComment.authorId = comment.user.id;
            trfComment.authorTrusted = comment.user.trusted;
          } else {
            trfComment.authorId = null;
            trfComment.authorTrusted = null;
          }
          return trfComment;
        });

        response.send(
          {
            auth: trfUser ?
              null :
              this.authorizationService.getProviders(),
            comments: trfComments,
            slug,
            user: trfUser
          }
        );
      });
  }

  public getRssFeedForModeration(request: Request, response: Response): void {
    if (!request.isAuthenticated()) {
      response.sendStatus(401);
    } else {
      if (!request.session.passport.user.administrator) {
        response.sendStatus(403);
      } else {
        const commentId = Number(request.params.id);
        if (isNaN(commentId)) {
          response.sendStatus(400);
        } else {
          this.commentService
            .getCommentsForModeration()
            .then(comments => {
              const feed = new rss({
                site_url: this.configurationService.getSchnackHost(),
                title: 'Awaiting moderation'
              });
              console.log(feed);
              comments.forEach(comment => {
                feed.item({
                  date: comment.created,
                  description: `A new comment on '${comment.slug}' is awaiting moderation`,
                  guid: comment.slug + '/' + comment.id,
                  title: `New comment on '${comment.slug}'`,
                  url: comment.slug + '/' + comment.id
                });
              });
              response.send(feed.xml({ indent: true }));
            })
            .catch(err => {
              console.log(err);
              response.sendStatus(500);
            });
        }
      }
    }
  }

  public markdown2Html(request: Request, response: Response): void {
    const comment = request.body.comment;
    response.send({ html: marked(comment.trim()) });
  }

  public postComment(request: Request, response: Response): void {
    if (!request.isAuthenticated()) {
      response.sendStatus(401);
    } else {
      this.commentService
        .getLastComment(
          request.session.passport.user.id,
          request.body.reply_to,
          request.params.slug)
        .then(lastComment => {
          if (lastComment && lastComment.comment === request.body.comment) {
            response.send({ status: 'rejected', reason: 'reason' });
          } else {
            this.commentService.createComment(
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
        });
    }
  }

  public rejectComment(request: Request, response: Response): void  {
    if (!request.isAuthenticated()) {
      response.sendStatus(401);
    } else {
      if (!request.session.passport.user.administrator) {
        response.sendStatus(403);
      } else {
        const commentId = Number(request.params.id);
        if (isNaN(commentId)) {
          response.sendStatus(400);
        } else {
          this.commentService
            .rejectComment(commentId)
            .then(comment => response.send({ status: 'ok' }))
            .catch(err => {
              console.log(err);
              response.sendStatus(500);
            });
        }
      }
    }
  }
}
