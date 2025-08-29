import { createClient, createConfig } from '@hey-api/client-fetch';
import type { ClientOptions } from './client/index.js';
import type { Client } from './client/client/types.js';
import { createHash } from 'node:crypto';
import { secp256k1 } from '@noble/curves/secp256k1';
import { PrivKey } from '@noble/curves/abstract/utils';
import { WalletApi } from './client/sdk.gen.js';

export * from './client/index.js';
export { Connect, WalletApi } from './client/sdk.gen.js';

/**
 * HandCash Item Management API
 * 
 * Provides a simple interface for managing digital items (NFTs) on the HandCash platform.
 * All functions require an authenticated client instance.
 */
export class Items {
  /**
   * Get a single item by its origin
   * @param client - Authenticated HandCash client instance
   * @param origin - The origin identifier of the item
   * @returns Promise containing the item data
   */
  static async getByOrigin(client: Client, origin: string) {
    return WalletApi.getV1WaasItemsByOrigin({
      client,
      path: { origin }
    });
  }

  /**
   * Get a single item by its origin (alias for getByOrigin)
   * @param client - Authenticated HandCash client instance
   * @param origin - The origin identifier of the item
   * @returns Promise containing the item data
   */
  static async get(client: Client, origin: string) {
    return WalletApi.getV1WaasItemsByOrigin({
      client,
      path: { origin }
    });
  }

  /**
   * Transfer items to another user or address
   * @param client - Authenticated HandCash client instance
   * @param items - Array of item origins to transfer
   * @param destination - HandCash handle or address of the recipient
   * @returns Promise containing the transfer result
   */
  static async transfer(client: Client, items: string[], destination: string) {
    return WalletApi.postV1WaasItemsTransfer({
      client,
      body: {
        destinationsWithOrigins: [{
          destination,
          origins: items
        }]
      }
    });
  }

  /**
   * Create and issue new items
   * @param client - Authenticated HandCash client instance
   * @param items - Array of item definitions to create
   * @param collectionId - Optional collection ID to associate with the items
   * @returns Promise containing the creation result
   */
  static async create(client: Client, items: Array<{
    name: string;
    description?: string;
    imageUrl: string;
    quantity?: number;
    rarity?: string;
    color?: string;
  }>, collectionId?: string) {
    return WalletApi.postV1WaasItemOrdersIssue({
      client,
      body: {
        itemCreationOrderType: 'collectionItem',
        referencedCollection: collectionId,
        items: items.map(item => ({
          name: item.name,
          description: item.description,
          mediaDetails: {
            image: {
              url: item.imageUrl,
              contentType: 'image/png'
            }
          },
          quantity: item.quantity || 1,
          rarity: item.rarity || 'common',
          color: item.color || '#000000'
        }))
      }
    });
  }

  /**
   * Burn items and create new ones in a single operation
   * @param client - Authenticated HandCash client instance
   * @param itemsToBurn - Array of item origins to burn
   * @param newItems - Array of item definitions to create
   * @param collectionId - Collection ID for the new items
   * @returns Promise containing the burn and create result
   */
  static async burnAndCreate(client: Client, itemsToBurn: string[], newItems: Array<{
    name: string;
    description?: string;
    imageUrl: string;
    quantity?: number;
    rarity?: string;
    color?: string;
  }>, collectionId: string) {
    return WalletApi.postV1WaasItemOrdersBurnAndCreate({
      client,
      body: {
        burn: {
          origins: itemsToBurn
        },
        issue: {
          items: newItems.map(item => ({
            name: item.name,
            description: item.description,
            mediaDetails: {
              image: {
                url: item.imageUrl,
                contentType: 'image/png'
              }
            },
            quantity: item.quantity || 1,
            rarity: item.rarity || 'common',
            color: item.color || '#000000'
          })),
          referencedCollection: collectionId,
          itemCreationOrderType: 'collectionItem'
        }
      }
    });
  }

  /**
   * Get items from a creation order
   * @param client - Authenticated HandCash client instance
   * @param orderId - The creation order ID
   * @returns Promise containing the order items
   */
  static async getFromOrder(client: Client, orderId: string) {
    return WalletApi.getV1WaasItemOrdersByItemCreationOrderIdItems({
      client,
      path: { itemCreationOrderId: orderId }
    });
  }

  /**
   * Get inventory with optional filters
   * @param client - Authenticated HandCash client instance
   * @param options - Optional filters and pagination parameters
   * @returns Promise containing the inventory data
   */
  static async getInventory(client: Client, options?: {
    from?: number;
    to?: number;
    searchString?: string;
    groupingValue?: string;
    collectionId?: string;
    fetchAttributes?: boolean;
    sort?: 'name';
    order?: 'asc' | 'desc';
    attributes?: Array<{
      name: string;
      displayType: 'string' | 'number';
      operation?: 'equal' | 'includes' | 'matches' | 'greater' | 'lower' | 'greaterOrEqual' | 'lowerOrEqual';
      value?: string | number;
      values?: Array<string | number>;
    }>;
    appId?: string;
    group?: boolean;
    externalId?: string;
  }) {
    return WalletApi.postV1WaasItems({
      client,
      body: {
        ...options,
        // This will return all items owned by the authenticated user
      }
    });
  }
}
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
