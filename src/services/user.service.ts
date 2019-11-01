import { Application } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { getRepository } from 'typeorm';

import { Comment, User } from '../db/entities';
import { environment } from '../environments/environment';

import { IService } from './service';

export interface IUserService extends IService {
  blockUser(userId: number): Promise<User>;
  createUser(
    provider: string,
    providerId: string,
    displayName: string,
    name: string,
    url: string): Promise<User>;
  findUser(provider: string, providerId: string): Promise<User>;
  trustUser(userId: number): Promise<User>;
}

@injectable()
export class UserService implements IUserService {

  // interface members
  public async blockUser(userId: number): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(userId);
    user.trusted = false;
    user.blocked = true;
    return userRepository.save(user);
  }

  public async initialize(app: Application): Promise<any> {
    const repository = getRepository(User);
    const searches = new Array<Promise<number>>();

    searches.push(repository.count({ where: { administrator: true } }));
    if (environment.allowAnonymous) {
      searches.push(
        repository.count(
          {
            where: { provider: 'local', provider_id: 'Anonymous' }
          }
        )
      );
    }

    return Promise.all(searches)
      .then((counts: Array<number>) => {
        const newUsers = new Array<User>();
        if (counts[0] === 0) {
          console.log('creating an administrator');
          newUsers.push(repository.create(
            {
              name: 'Administrator',
              display_name: 'Administrator',
              provider: 'local',
              provider_id: 'Administrator',
              administrator: true,
              blocked: false,
              trusted: true
            }
          ));
        } else {
          console.log('found an administrator');
        }
        if (environment.allowAnonymous) {
          if (counts[1] === 0) {
            newUsers.push(repository.create(
              {
                name: 'Anonymous',
                display_name: 'Anonymous user',
                provider: 'local',
                provider_id: 'Anonymous',
                administrator: false,
                blocked: false,
                trusted: true
              }
            ));
            console.log('creating an anonymous user');
          } else {
            console.log('found an anonymous user');
          }
        } else {
          console.log('no anonymous user needed');
        }
        if (newUsers.length > 0) {
          repository.save(newUsers);
        }
      });
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

  public async findUser(provider: string, providerId: string): Promise<User> {
    // SELECT id, name, display_name, provider, provider_id,
    //      trusted, blocked FROM user
    //    WHERE provider = ? AND provider_id = ?
    return getRepository(User).createQueryBuilder('user')
      .select()
      .where('user.provider = :provider', { provider })
      .andWhere('user.provider_id = :providerId', { providerId })
      .getOne();
  }

  public async trustUser(userId: number): Promise<User> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(userId);
    user.trusted = true;
    user.blocked = false;
    return userRepository.save(user);
  }
}
