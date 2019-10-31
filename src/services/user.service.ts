import { Application } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { getRepository } from "typeorm";


import { Comment, User } from '../db/entities';
import { IService } from './service';

export interface IUserService extends IService {

}

@injectable()
export class UserService implements IUserService {

  // interface members
  public async initialize(app: Application): Promise<any> {
    const repository = getRepository(User);
    const existing = await repository.find({ where: { administrator: true } });
    if (existing.length === 0) {
      const newUser = new User();
      newUser.name = 'Administrator';
      newUser.display_name = 'Administrator';
      newUser.provider = '';
      newUser.provider_id = '';
      newUser.administrator = true;
      newUser.blocked = false;
      newUser.trusted = true;
      return repository.save(newUser);
    };
    return Promise.resolve(true);
  }
}
