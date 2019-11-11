import { Authentication } from '../authentication/authentication';
import { Database } from '../database/database';
import { Notification } from '../notification/notification';
import { Client } from './client';
import { Server } from './server';

export class Environment {

  // public properties
  public authentication: Authentication;
  public client: Client;
  public database: Database;
  public notification: Notification;
  public server: Server;

  // constructor
  public constructor() {
    this.authentication = new Authentication();
    this.client = new Client();
    this.database = new Database();
    this.notification = new Notification();
    this.server = new Server();
  }

}
