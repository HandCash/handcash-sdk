/**
 * HandCash SDK Example - Item Management
 * 
 * This example demonstrates how to use the HandCash SDK for item management operations.
 * Replace the placeholder values with your actual HandCash app credentials and auth tokens.
 */

import { getInstance, Connect, Items } from './sdk.js';

const sdk = getInstance({
  appId: '<APP-ID>',
  appSecret: '<APP-SECRET>',
});

// Example: Get user profile (existing functionality)
async function getUserProfile() {
  const client = sdk.getAccountClient('your-auth-token');
  const result = await Connect.getCurrentUserProfile({ client });
  console.log('User profile:', result.data);
}

// Example: Get a single item by origin
async function getItem() {
  const client = sdk.getAccountClient('your-auth-token');
  const result = await Items.getByOrigin(client, 'item-origin');
  console.log('Item:', result.data);
}

// Example: Transfer items to another user
async function transferItems() {
  const client = sdk.getAccountClient('your-auth-token');
  const result = await Items.transfer(client, ['item-origin-1', 'item-origin-2'], 'destination-handle');
  console.log('Transfer result:', result.data);
}

// Example: Create new items
async function createItems() {
  const client = sdk.getAccountClient('your-auth-token');
  const result = await Items.create(client, [{
    name: 'My NFT',
    description: 'A unique digital item',
    imageUrl: 'https://example.com/image.png',
    quantity: 1,
    rarity: 'common',
    color: '#FF0000'
  }], 'collection-id');
  console.log('Create result:', result.data);
}

// Example: Get items from a creation order
async function getOrderItems() {
  const client = sdk.getAccountClient('your-auth-token');
  const result = await Items.getFromOrder(client, 'order-id');
  console.log('Order items:', result.data);
}

// Example: Burn and create items
async function burnAndCreateItems() {
  const client = sdk.getAccountClient('your-auth-token');
  const result = await Items.burnAndCreate(client, ['item-origin-to-burn'], [{
    name: 'Upgraded NFT',
    description: 'An upgraded version',
    imageUrl: 'https://example.com/upgraded.png',
    quantity: 1,
    rarity: 'rare',
    color: '#00FF00'
  }], 'collection-id');
  console.log('Burn and create result:', result.data);
}

// Example: Get inventory
async function getInventory() {
  const client = sdk.getAccountClient('your-auth-token');
  const result = await Items.getInventory(client, {
    from: 0,
    to: 50,
    sort: 'name',
    order: 'asc'
  });
  console.log('Inventory:', result.data);
}

// Example: Get inventory with filters
async function getInventoryFiltered() {
  const client = sdk.getAccountClient('your-auth-token');
  const result = await Items.getInventory(client, {
    collectionId: 'my-collection',
    searchString: 'rare',
    fetchAttributes: true,
    attributes: [{
      name: 'rarity',
      displayType: 'string',
      operation: 'equal',
      value: 'legendary'
    }]
  });
  console.log('Filtered inventory:', result.data);
}

console.log('HandCash SDK with Simple Item Management Functions');
console.log('Available functions:');
console.log('- getUserProfile() - Get current user profile');
console.log('- getItem() - Get a single item by origin');
console.log('- getInventory() - Get inventory with filters');
console.log('- transferItems() - Transfer items to another user');
console.log('- createItems() - Create new items');
console.log('- getOrderItems() - Get items from creation order');
console.log('- burnAndCreateItems() - Burn and create items');
