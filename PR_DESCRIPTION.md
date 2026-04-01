# PR: SDK types — locked items `userId` query

## Summary

Supports the new optional **`userId`** query parameter on **`GET /v3/wallet/items/locked`** (HandCash Cloud). Clients can pass the HandCash user ObjectId to receive only that user’s locked items.

## Files

- `src/client/types.gen.ts` — `GetV3WalletItemsLockedData.query.userId`
- `src/client/sdk.gen.ts` — updated JSDoc on `getV3WalletItemsLocked`

## Dependency

Requires cloud release that includes the **`userId`** query on `/v3/wallet/items/locked` (see **handcash-cloud** `PR_DESCRIPTION.md` for the locked-items filter PR).

## How to test

Call `HandCashCloud.getV3WalletItemsLocked({ query: { userId: '<24-char hex>' } })` and confirm the request includes `?userId=...`.
