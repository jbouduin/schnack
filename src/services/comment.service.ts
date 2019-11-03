import { Application } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { Brackets, createQueryBuilder, getRepository } from 'typeorm';

import { Comment, User } from '../db/entities';
import { IService } from './service';

export interface ICommentService extends IService {
  createComment(user: User, replyTo: number, slug: string, comment: string): Promise<Comment>;
  getCommentsBySlug(slug: string, userId: number, administrator: boolean): Promise<Array<Comment>>;
}

@injectable()
export class CommentService implements ICommentService {

  // interface members
  public async createComment(user: User, replyTo: number, slug: string, comment: string): Promise<Comment> {
    const commentRepository = getRepository(Comment);
    const newComment = await commentRepository.create(
      {
        comment,
        reply_to: replyTo,
        slug,
        user
      }
    );
    return commentRepository.save(newComment);
  }

  public async getCommentsBySlug(slug: string, userId: number, administrator: boolean): Promise<Array<Comment>> {


    const commentRepository = getRepository(Comment);

    var qryBuilder = commentRepository.createQueryBuilder('comment')
    .leftJoinAndSelect('comment.user', 'user')
    .where('comment.slug = :slug', { slug });

    if (administrator) {
      // SELECT user_id, user.name, user.display_name, comment.id,
      //     comment.created_at, comment, approved, trusted, provider,
      //     reply_to
      //   FROM comment INNER JOIN user ON (user_id=user.id)
      //   WHERE slug = ? AND NOT user.blocked
      //     AND NOT comment.rejected
      //   ORDER BY comment.created_at DESC
      qryBuilder.andWhere('not user.blocked')
        .andWhere('not comment.rejected');
    } else {
      // SELECT comment.id, user_id, user.name, user.display_name,
      //     user.url user_url, comment.created_at, comment, approved,
      //     trusted, provider, reply_to
      //   FROM comment INNER JOIN user ON (user_id=user.id)
      //   WHERE slug = ? AND ((
      //     NOT user.blocked AND NOT comment.rejected
      //     AND (comment.approved OR user.trusted))
      //     OR user.id = ?)
      //   ORDER BY comment.created_at DESC
      qryBuilder.andWhere(new Brackets(qb0 =>
        qb0.where(
          new Brackets(qb1 =>
            qb1.where('not user.blocked')
              .andWhere('not comment.rejected')
              .andWhere(
                new Brackets(qb2 =>
                  qb2.where('comment.approved')
                    .orWhere('user.trusted'))
              )
            )
          )
          .orWhere('user.id = :userId', { userId })
        )
      )
    }

    return qryBuilder
      .orderBy('comment.created', 'DESC')
      .getMany();
  }

  public async initialize(app: Application): Promise<any> {
    return Promise.resolve(true);
  }
}
