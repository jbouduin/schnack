import { Application } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { getRepository } from "typeorm";


import { Comment, User } from '../db/entities';
import { IService } from './service';

export interface ICommentService extends IService {
  getCommentsBySlug(slug: string): Promise<Array<Comment>>;
}

@injectable()
export class CommentService implements ICommentService {

  // interface members
  public initialize(app: Application): void { }

  public async getCommentsBySlug(slug: string): Promise<Array<Comment>> {
    const commentRepository = getRepository(Comment);
    return commentRepository.find({
      //select: ["firstName", "lastName"],
      relations: ["user"],
      where: { slug: slug },
      order: { created: "DESC" }
    });
  }
}
