# PR Summary: Docs update and auth flow image fix

**Branch:** `docs/sdk-update-and-image-fix`  
**Base:** `master`  
**Status:** Kept on this branch until the SDK/other release is ready to align with.

## Summary

Updates the HandCash Connect SDK docs to match the current `@handcash/sdk` API (getInstance, getAccountClient, Connect, Users, Items, PaymentRequests, Minter, `{ data, error }` pattern), fixes the auth flow image path so it resolves correctly, and adds dedicated pages for Items and Payment Requests.

## Changes

### Fix
- **Auth flow image:** `user-authorization.md` referenced `/../resources/images/handcash-connect-auth-flow.png`, which could 404 depending on hosting. Updated to `../resources/images/handcash-connect-auth-flow.png` so the image loads from `docs/` correctly (image file already exists at `resources/images/handcash-connect-auth-flow.png`).

### New docs
- **`docs/items.md`** — Inventory (Connect), transfer/lock/unlock/locked list (Items), and friends (Users) with code samples.
- **`docs/payment-requests.md`** — Create, list, get, update, delete payment requests and public info/stats, aligned to the generated `PaymentRequests` class.

### Updated copy
- **README.md** — Short intro pointing to `@handcash/sdk`, API reference, and dashboard.
- **`docs/_cover.md`** — Cover page text.
- **`docs/_sidebar.md`** — Navigation (includes new Items and Payment Requests sections).
- **`docs/getting-started.md`** — Quick start with `getInstance`, `getAccountClient`, and first payment using `{ data, error }`.
- **`docs/user-authorization.md`** — Overview, permissions table, and auth flow (with fixed image path).
- **`docs/user-profile.md`** — Balance, public profile, look up by handle, preferences.
- **`docs/payments.md`** — Simple payment, multiple receivers, currencies, attach data.
- **`docs/error-handling.md`** — Error handling and `{ data, error }` usage.

## Merge when

- You’re ready to publish or reference the same API surface (Connect, Users, Items, PaymentRequests, Minter, local spec flow) that the SDK PR introduces, so docs and SDK stay in sync.
