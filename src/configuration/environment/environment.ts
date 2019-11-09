import { Authentication } from '../authentication/authentication';
import { Database } from '../database/database';
import { Client } from './client';
import { Server } from './server';

export class Environment {

  // public properties
  public authentication: Authentication;
  public database: Database;
  public client: Client;
  public server: Server;

  // constructor
  public constructor() {
    this.authentication = new Authentication();
    this.client = new Client();
    this.database = new Database();
    this.server = new Server();
  }

}
