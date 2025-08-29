The HandCash SDK is a server-side Node.js library designed to securely interact with the HandCash Developer tools and APIs.

For full API reference and detailed usage examples, visit: https://cloud.handcash.io/sdk-docs/

## Change log

Please see [CHANGES.md](./CHANGES.md) for a list of notable changes and version history.

## Requirements

- Node `v16.X` or higher
- Only for NodeJS, i.e. it doesn't work on the browser side as it's a server-side library for security reasons.

## Documentation

- [Getting started](#getting-started)
    - [Developer dashboard](#developer-dashboard)
    - [Installation](#installation)
    - [Initiallization](#initialization)
- [HandCash Connect](#handcash-connect)
    - [Understanding permissions](#understanding-permissions)
    - [User Authorization](#user-authorization)
    - [Get user profile](#get-user-profile)
    - [Get spendable balance](#get-spendable-balances)
    - [Get exchange rate](#get-exchange-rate)
    - [Transfer money](#transfer-money)
- [Item Management](#item-management)
    - [Get a single item](#get-a-single-item)
    - [Get inventory](#get-inventory)
    - [Transfer items](#transfer-items)
    - [Create new items](#create-new-items)
    - [Burn and create items](#burn-and-create-items)
    - [Get items from order](#get-items-from-order)
- [Error Handling](#error-handling)
    - [Common Error Types](#common-error-types)

## Getting started

### Developer dashboard

To use this SDK, you’ll need an `appId` to identify your application and an `appSecret` to ensure all SDK operations are securely executed under your control.
> Don't have an app yet? Visit [dashboard.handcash.io](https://dashboard.handcash.io) and create your first app.
>

### Installation

`npm i @handcash/sdk`

## Initialization

To get started, create an instance of HandCashSDK. This instance serves as the main entry point for interacting with the SDK and accessing its features.

```typescript
import { getInstance, Connect } from '@handcash/sdk';

const sdk = getInstance({
  appId: '<APP-ID>',
  appSecret: '<APP-SECRET>',
});
```

## HandCash Connect
HandCash Connect allows users to connect their wallets to your game, allowing you to to access user data such as profile information, balance, transactions, inventory, and more.

### Understanding permissions

The `authToken` represents the set of permissions granted to your app, allowing it to access user data such as profile information, balance, transactions, and more.

You can configure the specific permissions your app needs directly from the HandCash Developer Dashboard.

![img.png](docs/images/img_1.png)

### User Authorization

To access user accounts, you need to obtain an `authToken`, which is granted when a user authorizes your app.

1. Generate the redirectionUrl that you shall use in your app to send the user to HandCash for authorization:

```typescript
const redirectionUrl = sdk.getRedirectionUrl();
console.log(redirectionUrl);
// https://market.handcash.io/connect?appId=661c33e4e0781c633162347f
```

2. Redirect the user to this URL from your application.
3. The user will be prompted to authorize your app to access their HandCash account:

![img.png](docs/images/img_2.png)

4. After authorization, the user will be redirected back to your app along with the `authToken`. Example: _https://my.app/auth/success?authToken=333b9370c083446e590dbb3a5e1ffe7aef5eb01a87c3b6ad4d7a4abc7a291602_

```typescript
const client = sdk.getAccountClient('333b9370c083446e590dbb3a5e1ffe7aef5eb01a87c3b6ad4d7a4abc7a291602');
```

You can specify the redirect URL, where users are sent after authorizing your app, directly in the HandCash Developer Dashboard.
This URL is where you’ll receive the authToken and continue the authentication flow.

![img_1.png](docs/images/img_3.png)

### Get user profile

The code below demonstrates how to retrieve a user’s profile.

```typescript
import { Connect } from '@handcash/sdk';

const client = sdk.getAccountClient(authToken);
const result = await Connect.getCurrentUserProfile({ client });
```

### Get spendable balances

Users can set daily spending limits for apps in their preferences.

```typescript
import { Connect } from '@handcash/sdk';

const client = sdk.getAccountClient(authToken);
const result = await Connect.getSpendableBalances({ client });
```

### Get exchange rate

You may want to retrieve exchange rates for a specific currency, and optionally lock a payment to that rate for a limited time after fetching it.

In this example, we fetch the exchange rate for USD. As you’ll notice, the client used here is a static client—not linked to any specific user.
This is possible because certain generic endpoints, like this one, don’t require user authentication, allowing the use of a static client.

```typescript
import { Connect } from '@handcash/sdk';

const client = sdk.getAccountClient(authToken);
const result = await Connect.getExchangeRate({ client: client, path: { currencyCode: 'USD' } });
```

### Transfer money

The code below demonstrates how to initiate a simple payment from the user’s wallet to another user.

In this example, the payment transfers an amount equivalent to 0.01 USD (denominated in BSV) to the user with the handle `nosetwo`.

```typescript
import { Connect } from '@handcash/sdk';

const client = sdk.getAccountClient(authToken);
const result = await Connect.pay({
  client,
  body: {
    instrumentCurrencyCode: 'BSV',
    denominationCurrencyCode: 'USD',
    receivers: [{
      sendAmount: 0.01,
      destination: 'nosetwo'
    }]
  }
});
```


## Item Management

HandCash SDK now supports comprehensive item management functionality, allowing you to create, transfer, and manage digital items (NFTs) on the HandCash platform.

### Get a single item

Retrieve a single item by its origin.

```typescript
import { Items } from '@handcash/sdk';

const client = sdk.getAccountClient(authToken);
const result = await Items.getByOrigin(client, 'item-origin');
```

### Transfer items

Transfer items to another user or address.

```typescript
import { Items } from '@handcash/sdk';

const client = sdk.getAccountClient(authToken);
const result = await Items.transfer(client, ['item-origin-1', 'item-origin-2'], 'destination-handle');
```

### Create new items

Create and issue new digital items to users.

```typescript
import { Items } from '@handcash/sdk';

const client = sdk.getAccountClient(authToken);
const result = await Items.create(client, [{
  name: 'My NFT',
  description: 'A unique digital item',
  imageUrl: 'https://example.com/image.png',
  quantity: 1,
  rarity: 'common',
  color: '#FF0000'
}], 'collection-id');
```

### Burn and create items

Burn existing items and create new ones in a single operation.

```typescript
import { Items } from '@handcash/sdk';

const client = sdk.getAccountClient(authToken);
const result = await Items.burnAndCreate(client, ['item-origin-to-burn'], [{
  name: 'Upgraded NFT',
  description: 'An upgraded version',
  imageUrl: 'https://example.com/upgraded.png',
  quantity: 1,
  rarity: 'rare',
  color: '#00FF00'
}], 'collection-id');
```

### Get items from order

Retrieve items associated with a specific item creation order.

```typescript
import { Items } from '@handcash/sdk';

const client = sdk.getAccountClient(authToken);
const result = await Items.getFromOrder(client, 'order-id');
```

### Get inventory

Get inventory with optional filters.

```typescript
import { Items } from '@handcash/sdk';

const client = sdk.getAccountClient(authToken);

// Basic inventory
const result = await Items.getInventory(client, {
  from: 0,
  to: 50
});

// Filtered inventory
const filtered = await Items.getInventory(client, {
  collectionId: 'my-collection',
  searchString: 'rare',
  sort: 'name',
  order: 'desc',
  fetchAttributes: true,
  attributes: [{
    name: 'rarity',
    displayType: 'string',
    operation: 'equal',
    value: 'legendary'
  }]
});
```


## Error Handling

The HandCash SDK uses a structured error handling approach to help you handle various types of errors that may occur during API interactions.

```typescript
import { getInstance, Connect } from '@handcash/sdk';

const client = sdk.getAccountClient(authToken);
const result = await Connect.pay({
  client,
  body: {
    instrumentCurrencyCode: 'BSV',
    denominationCurrencyCode: 'USD',
    receivers: [{
      sendAmount: 0.01,
      destination: 'nosetwo'
    }]
  }
});  
if (result.data) {
  // Payment successful console.log('Payment completed:', result.data);
}
if (result.error) {
  // Payment failed console.log('Payment failed:', result.error);
}

```

### Common Error Types

All SDK operations may throw the following types of errors:

1. **Authentication Errors**
  - Occurs when the provided `appId` or `appSecret` is invalid
  - Occurs when the user's `authToken` is invalid or expired

2. **Permission Errors**
  - Occurs when your app tries to access features not granted in its permissions
  - Occurs when a payment exceeds the user's spending limit

3. **Other Errors**
  - Occurs when the user has insufficient balance
  - Occurs when payment parameters are invalid
