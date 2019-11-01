import { TypeormStore } from "connect-typeorm";
import * as express from 'express';
import * as ExpressSession from "express-session";
import { inject, injectable } from 'inversify';
import * as passport from 'passport';
import * as facebook from 'passport-facebook';
import * as github from 'passport-github2';
import * as instagram from 'passport-instagram';
import * as google from 'passport-google-oauth';
import * as linkedin from 'passport-linkedin';
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
  public async initialize(app: express.Application): Promise<any> {
    const sessionRepository = getRepository(Session);
    app.use(ExpressSession({
        resave: false,
        saveUninitialized: true,
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

  private buildCallBackUrl(authorizer: string) {
    return `${environment.schnackProtocol}://${environment.schnackHostName}/auth/${authorizer}/callback`;
  }

  private initializePassport(app: express.Application) {

    app.use(passport.initialize());
    app.use(passport.session());
    const router = express.Router();

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
      this.initializeTwitter(router);
    }

    if (environment.oauthGitHub) {
      this.initializeGitHub(router);
    }

    if (environment.oauthGoogle) {
      this.initializeGoogle(router);
    }

    if (environment.oauthFacebook) {
      this.initializeFacebook(router);
    }

    if (environment.oauthLinkedIn) {
      this.initializeLinkedIn(router);
    }

    if (environment.oauthInstagram) {
      this.initializeInstagram(router);
    }

    app.use('/auth', router);
  }

  private initializeTwitter(router: express.Router) {
    this.providers.push({ id: 'twitter', name: 'Twitter' });
    passport.use(
      new twitter.Strategy(
        {
          consumerKey: environment.oauthTwitterConsumerKey,
          consumerSecret: environment.oauthTwitterConsumerSecret,
          callbackURL: this.buildCallBackUrl('twitter')
        },
        (token, tokenSecret, profile, done) => { done(null, profile); }
      )
    );

    router.get('/twitter', passport.authenticate('twitter'));

    router.get(
      '/twitter/callback',
      passport.authenticate('twitter', { failureRedirect: '/login' }),
      (request, reply) => { reply.redirect('/success'); }
    );
  }

  private initializeGitHub(router: express.Router) {
    this.providers.push({ id: 'github', name: 'Github' });
    passport.use(
      new github.Strategy(
        {
          clientID: environment.oauthGitHubClientId,
          clientSecret: environment.oauthGitHubClientSecret,
          callbackURL: this.buildCallBackUrl('github')
        },
        (accessToken, refreshToken, profile, done) => { done(null, profile); }
      )
    );

    router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

    router.get(
      '/github/callback',
      passport.authenticate('github', { failureRedirect: '/login' }),
      (request, reply) => { reply.redirect('/success'); }
    );
  }

  private initializeGoogle(router: express.Router) {
    this.providers.push({ id: 'google', name: 'Google' });
    passport.use(
      new google.Strategy(
        {
          clientID: environment.oauthGoogleClientId,
          clientSecret: environment.oauthGoogleClientSecret,
          callbackURL: this.buildCallBackUrl('google')
        },
        (accessToken, refreshToken, profile, done) => { done(null, profile); }
      )
    );

    router.get(
      '/google',
      passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login']
      })
    );

    router.get(
        '/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        (request, reply) => { reply.redirect('/success'); }
    );
  }

  private initializeFacebook(router: express.Router) {
    this.providers.push({ id: 'facebook', name: 'Facebook' });
    passport.use(
      new facebook.Strategy(
        {
          clientID: environment.oauthFacebookClientId,
          clientSecret: environment.oauthFacebookClientSecret,
          callbackURL: this.buildCallBackUrl('facebook')
        },
        (accessToken, refreshToken, profile, done) => { done(null, profile); }
      )
    );

    router.get('/facebook', passport.authenticate('facebook'));

    router.get(
        '/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        (request, reply) => { reply.redirect('/success'); }
    );
  }

  private initializeInstagram(router: express.Router) {
    this.providers.push({ id: 'instagram', name: 'Instagram' });
    passport.use(
      new instagram.Strategy(
        {
          clientID: environment.oauthInstagramClientId,
          clientSecret: environment.oauthInstagramClientSecret,
          callbackURL: this.buildCallBackUrl('instagram')
        },
        (accessToken, refreshToken, profile, done) => { done(null, profile); }
      )
    );

    router.get('/instagram', passport.authenticate('instagram'));

    router.get(
        '/instagram/callback',
        passport.authenticate('instagram', { failureRedirect: '/login' }),
        (request, reply) => { reply.redirect('/success'); }
    );
  }

  private initializeLinkedIn(router: express.Router) {
    this.providers.push({ id: 'linkedin', name: 'LinkedIn' });
    passport.use(
      new linkedin.Strategy(
        {
          clientID: environment.oauthLinkedInClientId,
          clientSecret: environment.oauthLinkedInClientSecret,
          callbackURL: this.buildCallBackUrl('instagram')
        },
        (accessToken, refreshToken, profile, done) => { done(null, profile); }
      )
    );

    router.get('/instagram', passport.authenticate('instagram'));

    router.get(
        '/instagram/callback',
        passport.authenticate('instagram', { failureRedirect: '/login' }),
        (request, reply) => { reply.redirect('/success'); }
    );
  }
}
