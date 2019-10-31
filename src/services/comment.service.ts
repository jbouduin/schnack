import { Application } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { Brackets, createQueryBuilder, getRepository } from "typeorm";


import { Comment, User } from '../db/entities';
import { IService } from './service';

export interface ICommentService extends IService {
  getCommentsBySlug(slug: string, userId: number): Promise<Array<Comment>>;
}

@injectable()
export class CommentService implements ICommentService {

  // interface members
  public async initialize(app: Application): Promise<any> {
    return Promise.resolve(true);
  }

  public async getCommentsBySlug(slug: string, userId: number): Promise<Array<Comment>> {
    // const get_comments = 'SELECT comment.id, user_id, user.name, user.display_name,
    //     user.url user_url, comment.created_at, comment, approved,
    //     trusted, provider, reply_to
    //   FROM comment INNER JOIN user ON (user_id=user.id)
    //   WHERE slug = ? AND ((
    //     NOT user.blocked AND NOT comment.rejected
    //     AND (comment.approved OR user.trusted))
    //     OR user.id = ?)
    //   ORDER BY comment.created_at DESC';

    const commentRepository = getRepository(Comment);
    return commentRepository.createQueryBuilder('comment')
    .leftJoinAndSelect('comment.user', 'user')
    .select('comment.id', 'id')
    .addSelect('user.id', 'user_id')
    .addSelect('user.name', 'name')
    .addSelect('user.display_name', 'display_name')
    .addSelect('user.url', 'user_url')
    .addSelect('comment.created', 'created_at')
    .addSelect('comment.comment', 'comment')
    .addSelect('comment.approved', 'approved')
    .addSelect('user.trusted', 'trusted')
    .addSelect('user.provider', 'provider')
    .addSelect('comment.reply_to', 'reply_to')
    .where('comment.slug = :slug', { slug: slug })
    .andWhere(new Brackets(qb0 =>
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
        .orWhere('user.id = :userId', { userId: userId})
      )
    )
    .printSql()
    .getMany();

    // console.log(sql);
    //
    //
    // return commentRepository.find({
    //
    //   relations: ["user"],
    //   where: { slug: slug },
    //   order: { created: "DESC" }
    // });
  }
}
