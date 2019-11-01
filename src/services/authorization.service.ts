import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as passport from 'passport';
import * as facebook from 'passport-facebook';
import * as github from 'passport-github2';
import * as google from 'passport-google-oauth';
import * as instagram from 'passport-instagram';
import * as linkedin from 'passport-linkedin';
import * as local from 'passport-local';
import * as twitter from 'passport-twitter';
import 'reflect-metadata';

import { environment } from '../environments/environment';
import SERVICETYPES from '../services/service.types';
import container from '../inversify.config';

import { IService } from './service';
import { IHelperService} from './helper.service';
import { IUserService } from './user.service';

export interface IProvider {
  id: string;
  name: string;
}

export interface IAuthorizationService extends IService {
  getProviders(): Array<IProvider>;
}

@injectable()
export class AuthorizationService implements IAuthorizationService {

  // fields
  private providers = new Array<IProvider>();

  // constructor
  public constructor(
    @inject(SERVICETYPES.HelperService) private helperService: IHelperService,
    @inject(SERVICETYPES.UserService) private userService: IUserService) { }

  // interface members
  public async initialize(app: express.Application): Promise<any> {
    this.initializePassport(app);
    return Promise.resolve(this.providers);
  }

  public getProviders(): Array<IProvider> {
    return this.providers;
  }

  // private methods
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
            user.profileUrl || ''
          )
          .then(created => {
            this.userService
              .findUser(user.provider, user.id)
              .then(newRow => {
                if (newRow) {
                  return done(null, newRow); // welcome new user
                }
                console.error('no user found after insert');
              })
              .catch(err => console.error('could not find user', err));
            })
          .catch(err => console.error('could not create user', err));
        })
        .catch(err => console.error('could not find user', err));
    });

    passport.deserializeUser((user: any, done: any) => {
      done(null, { id: user.provider_id, provider: user.provider });
    });

    router.get('/signout', (request, reply) => {
      delete request.session.passport;
      reply.send({ status: 'ok' });
    });

    router.get('/success', (request, reply) => {
        const schnackDomain = this.helperService.getSchnackDomain();
        reply.send(`<script>
            document.domain = '${schnackDomain}';
            window.opener.__schnack_wait_for_oauth();
        </script>`);
    });

    if (environment.allowAnonymous) {
      this.initializeAnonymus(router);
    }

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

  private initializeAnonymus(router): void {
    this.providers.push({ id: 'anonymous', name: 'Post anonymous' });
    passport.use(new local.Strategy(
        function(user, password, done) {
          return done(null, { id: 'Anonymous', provider: 'local' })
        }
      )
    );

    router.post(
      '/anonymous',
      passport.authenticate('local', { session: true}),
      (request, reply) => {
        reply.redirect('/auth/success');

      }
    );
  }

  private initializeTwitter(router: express.Router): void {
    this.providers.push({ id: 'twitter', name: 'Twitter' });
    passport.use(
      new twitter.Strategy(
        {
          callbackURL: this.buildCallBackUrl('twitter'),
          consumerKey: environment.oauthTwitterConsumerKey,
          consumerSecret: environment.oauthTwitterConsumerSecret
        },
        (token, tokenSecret, profile, done) => { done(null, profile); }
      )
    );

    router.get('/twitter', passport.authenticate('twitter'));

    router.get(
      '/twitter/callback',
      passport.authenticate('twitter', { failureRedirect: '/login' }),
      (request, reply) => { reply.redirect('/auth/success'); }
    );
  }

  private initializeGitHub(router: express.Router): void {
    this.providers.push({ id: 'github', name: 'Github' });
    passport.use(
      new github.Strategy(
        {
          callbackURL: this.buildCallBackUrl('github'),
          clientID: environment.oauthGitHubClientId,
          clientSecret: environment.oauthGitHubClientSecret
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

  private initializeGoogle(router: express.Router): void {
    this.providers.push({ id: 'google', name: 'Google' });
    passport.use(
      new google.Strategy(
        {
          callbackURL: this.buildCallBackUrl('google'),
          clientID: environment.oauthGoogleClientId,
          clientSecret: environment.oauthGoogleClientSecret
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

  private initializeFacebook(router: express.Router): void {
    this.providers.push({ id: 'facebook', name: 'Facebook' });
    passport.use(
      new facebook.Strategy(
        {
          callbackURL: this.buildCallBackUrl('facebook'),
          clientID: environment.oauthFacebookClientId,
          clientSecret: environment.oauthFacebookClientSecret
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

  private initializeInstagram(router: express.Router): void {
    this.providers.push({ id: 'instagram', name: 'Instagram' });
    passport.use(
      new instagram.Strategy(
        {
          callbackURL: this.buildCallBackUrl('instagram'),
          clientID: environment.oauthInstagramClientId,
          clientSecret: environment.oauthInstagramClientSecret
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

  private initializeLinkedIn(router: express.Router): void {
    this.providers.push({ id: 'linkedin', name: 'LinkedIn' });
    passport.use(
      new linkedin.Strategy(
        {
          callbackURL: this.buildCallBackUrl('instagram'),
          clientID: environment.oauthLinkedInClientId,
          clientSecret: environment.oauthLinkedInClientSecret
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
