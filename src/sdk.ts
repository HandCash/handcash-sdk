import { createClient, createConfig } from '@hey-api/client-fetch';
import type { ClientOptions } from './client/index.js';
import { createHash } from 'node:crypto';
import { secp256k1 } from '@noble/curves/secp256k1';
import { PrivKey } from '@noble/curves/abstract/utils';

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
         return `https://app.handcash.io/#/authorizeApp?${encodedParams}`;
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

      const publicKey = Buffer.from(secp256k1.getPublicKey(authToken)).toString('hex');
      const signature = getRequestSignature(
          method,
          endpoint,
          body,
          timestamp,
          authToken,
          nonce
      );

      request.headers.set('oauth-signature', signature);
      request.headers.set('oauth-publickey', publicKey);
      request.headers.set('oauth-timestamp', timestamp);
      request.headers.set('oauth-nonce', nonce);

      return request;
   };
}

function getRequestSignature(
    method: string,
    endpoint: string,
    body: string | undefined = '',
    timestamp: string,
    privateKey: PrivKey,
    nonce: string
): string {
   const signaturePayload = `${method}\n${endpoint}\n${timestamp}\n${body}\n${nonce}`;
   const payloadHash = createHash('sha256').update(signaturePayload).digest('hex');
   return secp256k1.sign(payloadHash, privateKey).toDERHex();
}
