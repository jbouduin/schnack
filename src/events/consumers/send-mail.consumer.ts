import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { Comment } from '../../db/entities';
import { IConfigurationService } from '../../services';

import { EventType, IEvent } from '..';

import { ConsumerCallback, IConsumer } from './consumer';

import SERVICETYPES from '../../services/service.types';

export interface ISendMailConsumer extends IConsumer { }

export class SendMailConsumer implements ISendMailConsumer {
  private sendmail = {
    from: null,
    to: null
  };

  // constructor
  public constructor(
    @inject(SERVICETYPES.ConfigurationService) private configurationService: IConfigurationService) { }

  // interface members
  public registerConsumers(): Array<[EventType, ConsumerCallback]> {
    const result = new Array<[EventType, ConsumerCallback]>();
    if (this.sendmail.to && this.sendmail.from) {
      result.push([EventType.NewComment, this.newCommentCallBack]);
    }
    return result;
  }

  // callback method
  private newCommentCallBack(comment: Comment): void {
    try {
      const sendmail = null; // TODO spawn('sendmail', [this.sendmail.to]);
      sendmail.stdin.write(this.createEmailBody(comment));
      sendmail.stdin.end();
    } catch (error) {
      console.error('Error sending sendmail notification:', error);
    }
  }

  // helper methods
  private createEmailBody(comment: Comment): string {
      const postUrl = this.configurationService.getPageUrl().replace('%SLUG%', comment.slug);
      const user = comment.user.display_name || comment.user.name;

      const result = `
  To: Schnack Admin <${this.sendmail.to}>
  From: ${user} <${this.sendmail.from}>
  Subject: New comment on your post ${comment.slug}

  New comment on your post ${postUrl}

  Author: ${user}

  ${comment.comment}

  You can see all comments on this post here:
  ${postUrl}#comments

  Permalink: ${postUrl}#comment-${comment.id}
  `
          .split(/\n/)
          .join('\r\n')
          .trim();

      return result;
  }

}
