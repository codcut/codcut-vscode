import { makeRequest } from "./network";
import * as queryString from 'query-string';
import { RESOURCE_HOST } from "./config";

// /api/auth/trade
interface ITradeTokenParams {
  client_id: string;
  redirect_uri: string;
  authorization_token: string;
  code_verifier: string;
}

export const tradeTokenReq = (params: ITradeTokenParams) =>
  makeRequest(`${RESOURCE_HOST}/auth/trade?${queryString.stringify(params)}`, 'GET');