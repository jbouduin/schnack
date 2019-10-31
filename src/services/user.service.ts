import { Application } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { getRepository } from "typeorm";


import { Comment, User } from '../db/entities';
import { IService } from './service';

export interface IUserService extends IService {
  createUser(
    provider: string,
    providerId: string,
    displayName: string,
    name: string,
    url: string): Promise<User>;
  findUser(provider: string, providerId: string): Promise<User>;
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

  public async findUser(provider: string, providerId: string): Promise<User> {
    // SELECT id, name, display_name, provider, provider_id,
    //      trusted, blocked FROM user
    //    WHERE provider = ? AND provider_id = ?
    const userRepository = getRepository(User);
    return userRepository.createQueryBuilder('user')
      .select()
      .where('user.provider = :provider', { provider: provider })
      .andWhere('user.provider_id = :providerId', { providerId: providerId })
      .getOne();
  }

  public async createUser(
    provider: string,
    providerId: string,
    displayName: string,
    name: string,
    url: string): Promise<User> {

    const repository = getRepository(User);
    const newUser = new User();
    newUser.provider = provider;
    newUser.provider_id = providerId;
    newUser.display_name = displayName;
    newUser.name = name;
    newUser.url = url;
    newUser.trusted = false;
    newUser.blocked = false;
    newUser.administrator = false;
    return repository.save(newUser);
  }
}
