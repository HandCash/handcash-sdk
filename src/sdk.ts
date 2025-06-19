import { createClient, createConfig } from '@hey-api/client-fetch';
import bsv from 'bsv';
import type { ClientOptions } from './client/index.js';

const { PrivateKey, PublicKey } = bsv;
const { ECDSA, Hash } = bsv.crypto;

export type ConnectOptions = {
   appSecret: string;
   appId: string;
   baseUrl?: string;
};

export function getInstance(options: ConnectOptions) {
   return {
      getAccountClient: (privateKey : string) => getClient(options,  privateKey),
      client: getClient(options),
   }
}

export function getClient(options: ConnectOptions, privateKey?: string) {
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

   if (privateKey) {
      client.interceptors.request.use(createAuthInterceptor(privateKey));
   }
   return client;
}

function createAuthInterceptor(privateKey: string) {
   return async function (request: any) {
      const timestamp = new Date().toISOString();
      const nonce = Math.random().toString(36).substring(2);
      const { method } = request;
      const body = await request.clone().text();
      const endpoint = new URL(request.url).pathname;

      const payload = `${method}\n${endpoint}\n${timestamp}\n${body || ''}\n${nonce}`;
      const hashedPayload = Hash.sha256(Buffer.from(payload));
      const privateKeyObject = PrivateKey(privateKey);
      const publicKey = PublicKey.fromPrivateKey(privateKeyObject).toHex();
      const signature = ECDSA.sign(hashedPayload, privateKeyObject).toString();

      request.headers.set('oauth-signature', signature);
      request.headers.set('oauth-publickey', publicKey);
      request.headers.set('oauth-timestamp', timestamp);
      request.headers.set('oauth-nonce', nonce);

      return request;
   };
}
