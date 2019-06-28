import fetch from 'node-fetch';

type TMethod = 'GET' | 'POST';

export function makeRequest(endpoint: string, method: TMethod, body: string = '', token: string = '') {
  const headers: { [name: string]: string } = {};

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }


  return fetch(endpoint, {
    method: method,
    headers: headers,
    body: method === 'GET' ? undefined : body
  });
}