
export class Server {

  // public properties
  public hostname: string;
  public port: number;
  public protocol: string;
  public serveStatic: Array<string>;

  // constructor
  public constructor() {
    this.hostname = process.env.SCHNACK_HOST || process.env.SCHNACK_HOSTNAME || 'localhost';
    this.port = Number(process.env.SCHNACK_PORT) || 3000;
    this.protocol = process.env.SCHNACK_PROTOCOL || 'https';
  }
}
