import { createClient, createConfig } from '@hey-api/client-fetch';
import bsv from 'bsv';
import type { ClientOptions } from './client/index.js';

const { PrivateKey, PublicKey } = bsv;
const { ECDSA, Hash } = bsv.crypto;

export * from './client/index.js';
export type ConnectOptions = {
   appSecret: string;
   appId: string;
   baseUrl?: string;
};
export type QueryParams = Record<string, string>;

export function getInstance(options: ConnectOptions) {
   return {
      getAccountClient: (authToken : string) => getClient(options,  authToken),
      client: getClient(options),
      getRedirectionUrl: (queryParameters: QueryParams = {}) => {
      queryParameters.appId = options.appId;
      const encodedParams = Object.entries(queryParameters)
          .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
          .join('&');
      return `${options.baseUrl}/#/authorizeApp?${encodedParams}`;
   }
   }
}

function getClient(options: ConnectOptions, authToken?: string) {
   const client= createClient(createConfig<ClientOptions>());
   const config = {
      baseUrl: 'https://cloud.handcash.io',
      ...options
   };

   client.setConfig({
      baseUrl: config.baseUrl,
      headers: {
         'app-secret': config.appSecret,
         'app-id': config.appId,
      }
   });

   if (authToken) {
      client.interceptors.request.use(createAuthInterceptor(authToken));
   }
   return client;
}

function createAuthInterceptor(authToken: string) {
   return async function (request: any) {
      const timestamp = new Date().toISOString();
      const nonce = Math.random().toString(36).substring(2);
      const { method } = request;
      const body = await request.clone().text();
      const endpoint = new URL(request.url).pathname;

      const payload = `${method}\n${endpoint}\n${timestamp}\n${body || ''}\n${nonce}`;
      const hashedPayload = Hash.sha256(Buffer.from(payload));
      const accessKeyObject = PrivateKey(authToken);
      const publicKey = PublicKey.fromPrivateKey(accessKeyObject).toHex();
      const signature = ECDSA.sign(hashedPayload, accessKeyObject).toString();

      request.headers.set('oauth-signature', signature);
      request.headers.set('oauth-publickey', publicKey);
      request.headers.set('oauth-timestamp', timestamp);
      request.headers.set('oauth-nonce', nonce);

      return request;
   };
}
