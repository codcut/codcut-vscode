import AuthServer from '../AuthServer';
import * as vscode from 'vscode';
import * as CryptoJS from 'crypto-js';
import * as queryString from 'query-string';
import fetch from 'node-fetch';
import { AUTHENTICATION_HOST } from '../../utils/config';
import { tradeTokenReq } from '../../utils/api';

interface IAuthenticatorOptions {
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
    const { options, verifier } = this;
    vscode.env.openExternal(vscode.Uri.parse(this._generateAuthLink()));

    return new Promise<string>((resolve, reject) => {
      this.AS
        .start()
        .then((res) => {
          if (res.state !== this.state) {
            return Promise.reject();
          }

          const params = {
            client_id: options.clientId,
            redirect_uri: this._generateRedirectUri(),
            authorization_token: res.code,
            code_verifier: verifier
          };

          return tradeTokenReq(params)
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

    return `${AUTHENTICATION_HOST}/auth?${queryString.stringify(params)}`;
  }

  _generateRandom(n: number) {
    return CryptoJS.lib.WordArray.random(n).toString();
  }

  _generateChallenge(verifier: string) {
    return CryptoJS.SHA3(verifier, { outputLength: 256 }).toString();
  }
}

export default Authenticator;