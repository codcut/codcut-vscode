import AuthServer from '../AuthServer';
import * as vscode from 'vscode';
import * as CryptoJS from 'crypto-js';
import * as queryString from 'query-string';
import fetch from 'node-fetch';

interface IAuthenticatorOptions {
  authenticationEndpoint: string;
  tradeEndpoint: string;

  clientId: string;

  redirectPort: number;
  redirectHost: string;
}

class Authenticator {
  AS: AuthServer;

  verifier: string;
  challenge: string;
  state: string;

  options: IAuthenticatorOptions = {
    authenticationEndpoint: 'http://localhost:8081/auth',
    tradeEndpoint: 'http://localhost:8080/api/auth/trade',

    clientId: 'PluginApplication',

    redirectPort: 8087,
    redirectHost: 'localhost'
  };

  constructor(userOptions: Partial<IAuthenticatorOptions> = {}) {
    this.verifier = this._generateRandom(16);
    this.challenge = this._generateChallenge(this.verifier);
    this.state = this._generateRandom(16);

    this.AS = new AuthServer();

    this.options = {
      ...this.options,
      ...userOptions
    };

    
  }

  start() {
    vscode.env.openExternal(vscode.Uri.parse(this._generateAuthLink()));

    return new Promise<string>((resolve, reject) => {
      this.AS
        .start()
        .then((res) => {
          if (res.state !== this.state) {
            return Promise.reject();
          }

          const tradeEndpoint = this._generateTradeEndpoint(res.code);
          console.log('Trade endpoint', tradeEndpoint);
          return fetch(tradeEndpoint)
            .then(res => res.json())
            .then(json => resolve(json.token as string))
            .catch(() => reject());
        })
        .catch(() => reject())
        .finally(() => this.AS.stop());
    });
  }

  _generateRedirectUri() {
    const { options } = this;
    
    return `http://${options.redirectHost}:${options.redirectPort}`;
  }

  _generateAuthLink() {
    const { options } = this;

    const params = {
      client_id: options.clientId,
      redirect_uri: this._generateRedirectUri(),
      state: this.state,
      code_challenge: this.challenge
    };

    return `${options.authenticationEndpoint}?${queryString.stringify(params)}`;
  }

  _generateTradeEndpoint(authToken: string) {
    const { options } = this;

    const params = {
      client_id: options.clientId,
      redirect_uri: this._generateRedirectUri(),
      authorization_token: authToken,
      code_verifier: this.verifier
    };

    return `${options.tradeEndpoint}?${queryString.stringify(params)}`;
  }

  _generateRandom(n: number) {
    return CryptoJS.lib.WordArray.random(n).toString();
  }

  _generateChallenge(verifier: string) {
    return CryptoJS.SHA3(verifier, { outputLength: 256 }).toString();
  }
}

export default Authenticator;