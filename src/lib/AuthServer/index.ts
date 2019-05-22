import * as express from 'express';
import { Http2Server } from 'http2';

interface IAuthServerOptions {
  port: number;
  authRoute: string;
}

interface IAuthServerResolve {
  state: string;
  code: string;
}

class AuthServer {
  app: express.Application;
  server: Http2Server | null;

  options: IAuthServerOptions = {
    port: 8087,
    authRoute: '/'
  };

  constructor(userOptions: Partial<IAuthServerOptions> = {}) {
    this.app = express();
    this.server = null;

    this.options = {
      ...this.options,
      ...userOptions
    };
  }

  start() {
    const { app } = this; 
    const { port, authRoute } = this.options;

    return new Promise<IAuthServerResolve>((resolve, reject) => {
      app.get(authRoute, (req, res) => {
        const { state, code } = req.query;
        
        if (state && code) {
          resolve({ state, code });
        }
        else {
          reject();
        }

        res.send('Ok');
      });

      this.server = app.listen(port);
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
  }
}

export default AuthServer;