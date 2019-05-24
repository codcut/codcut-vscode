import { makeRequest } from "./network";
import * as queryString from 'query-string';
import { RESOURCE_HOST } from "./config";

// GET /api/auth/trade
export interface ITradeTokenParams {
  client_id: string;
  redirect_uri: string;
  authorization_token: string;
  code_verifier: string;
}

export const tradeTokenReq = (params: ITradeTokenParams) =>
  makeRequest(`${RESOURCE_HOST}/api/auth/trade?${queryString.stringify(params)}`, 'GET');

// POST /api/posts
export interface ICreatePostParams {
  code: string;
  body: string;
  language: string;
}

export const createPostReq = (params: ICreatePostParams, token: string) =>
  makeRequest(`${RESOURCE_HOST}/api/posts`, 'POST', JSON.stringify(params), token);