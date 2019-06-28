import { makeRequest } from "./network";
import { RESOURCE_HOST } from "./config";

// POST /api/posts

export interface ICreatePostParams {
  code: string;
  body: string;
  language: string;
}

export const createPostReq = (params: ICreatePostParams, token: string) =>
  makeRequest(`${RESOURCE_HOST}/posts`, 'POST', JSON.stringify(params), token);