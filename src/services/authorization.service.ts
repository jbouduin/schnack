import { TypeormStore } from "connect-typeorm";
import { Application } from 'express';
import * as ExpressSession from "express-session";
import { inject, injectable } from 'inversify';
import * as passport from 'passport';
import * as twitter from 'passport-twitter';
import { getRepository } from "typeorm";

import { Session } from "../db/entities";
import { environment } from '../environments/environment';
import { IUserService } from '../services';
import { IService } from './service';

import SERVICETYPES from '../services/service.types';

import 'reflect-metadata';
export interface IProvider {
  id: string;
  name: string
}

export interface IAuthorizationService extends IService {
  getProviders(): Array<IProvider>;
}

@injectable()
export class AuthorizationService implements IAuthorizationService {

  // fields
  private providers = new Array<IProvider>();

  // interface members
  public async initialize(app: Application): Promise<any> {
    const sessionRepository = getRepository(Session);
    app.use(ExpressSession({
        resave: false,
        saveUninitialized: false,
        secret: 'authConfig.secret',
        cookie: { secure: true, domain: this.getSchnackDomain() },
        store: new TypeormStore({
          cleanupLimit: 2,
          limitSubquery: false, // If using MariaDB.
          ttl: 86400
        }).connect(sessionRepository),
    }));

    this.initializePassport(app);


    // this.providers.push({ id: 'mastodon', name: 'Mastodon' });
    return Promise.resolve(this.providers);
  }

  public getProviders(): Array<IProvider> {
    return this.providers;
  }

  // constructor
  public constructor(
    @inject(SERVICETYPES.UserService) private userService: IUserService) { }

  // private methods
  private getSchnackDomain(): string {
    const schnackHostName = environment.schnackHostName;

    if (schnackHostName === 'localhost')
      return schnackHostName;

    try {
      return schnackHostName
        .split('.')
        .slice(1)
        .join('.');
    } catch (error) {
      console.error(
        `The schnackHostName value "${schnackHostName}" doesn't appear to be a valid hostname`
      );
      process.exit(-1);
    }
  }

  private initializePassport(app: Application) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user: any, done: any) => {
      this.userService
        .findUser(user.provider, user.id)
        .then(row => {
          if (row) {
            return done(null, row); // welcome back
          }
          // create a new user
          this.userService.createUser(
            user.provider,
            user.id,
            user.displayName,
            user.username || user.displayName,
            user.profileUrl || '',
          )
          .then(created => {
            this.userService
              .findUser(user.provider, user.id)
              .then(row => {
                if (row) {
                  return done(null, row); // welcome new user
                }
                console.error('no user found after insert');
              })
              .catch(err => { return console.error('could not find user', err); });
            })
          .catch(err => { return console.error('could not create user', err); });
        })
        .catch(err => { return console.error('could not find user', err); });
    });

    passport.deserializeUser((user: any, done: any) => {
        done(null, {
            provider: user.provider,
            id: user.provider_id
        });
    });

    if (environment.oauthTwitter) {
      this.initializeTwitter(app);
    }

    if (environment.oauthGitHub) {
      this.initializeGitHub(app);
    }

    if (environment.oauthGoogle) {
      this.initializeGoogle(app);
    }

    if (environment.oauthFacebook) {
      this.initializeFacebook(app);
    }

    if (environment.oauthLinkedIn) {
      this.initializeLinkedIn(app);
    }

    if (environment.oauthInstagram) {
      this.initializeInstagram(app);
    }
  }

  private initializeTwitter(app: Application) {
    this.providers.push({ id: 'twitter', name: 'Twitter' });
    passport.use(
        new twitter.Strategy(
            {
                consumerKey: environment.oauthTwitterConsumerKey,
                consumerSecret: environment.oauthTwitterConsumerSecret,
                callbackURL: `${environment.schnackProtocol}://${environment.schnackHostName}/auth/twitter/callback`
            },
            (token, tokenSecret, profile, done) => {
                done(null, profile);
            }
        )
    );

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get(
        '/auth/twitter/callback',
        passport.authenticate('twitter', {
            failureRedirect: '/login'
        }),
        (request, reply) => {
            reply.redirect('/success');
        }
    );
  }

  private initializeGitHub(app: Application) {
    this.providers.push({ id: 'github', name: 'Github' });
  }

  private initializeGoogle(app: Application) {
    this.providers.push({ id: 'google', name: 'Google' });
  }

  private initializeFacebook(app: Application) {
    this.providers.push({ id: 'facebook', name: 'Facebook' });
  }

  private initializeInstagram(app: Application) {
    this.providers.push({ id: 'instagram', name: 'Instagram' });
  }

  private initializeLinkedIn(app: Application) {
    this.providers.push({ id: 'linkedin', name: 'LinkedIn' });
  }
}
