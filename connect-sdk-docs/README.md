# HandCash developer documentation

Mintlify source for [docs.handcash.io](https://docs.handcash.io). Lives in the **`handcash-sdk`** repo at `connect-sdk-docs/` (the standalone `handcash-connect-sdk-docs` GitHub repo is archived).

This site contains **HandCash Connect (v3 SDK)** documentation that **replaces** the legacy **`docs.handcash.io/v2/handcash-connect/*`** guides and the **`@handcash/handcash-connect`** package.

There is **no `index.html`** in this repo. The docs are **Mintlify** (`docs.json` + `.mdx` files). Do not point “Live Preview” or a generic static server at the repo root—you will not see the handbook. Use **`npm run docs:dev`** and open the URL Mintlify prints (localhost).

## Mintlify (primary — use this)

- **Config:** [`docs.json`](./docs.json)
- **Pages:** [`wallet-api/*.mdx`](./wallet-api/) (Wallet API / WaaS), [`connect/*.mdx`](./connect/) (Connect SDK), [`introduction.mdx`](./introduction.mdx), [`legacy/v2-connect.mdx`](./legacy/v2-connect.mdx), [`api-reference/overview.mdx`](./api-reference/overview.mdx)
- **Discoverability:** [`llms.txt`](./llms.txt)

### Local preview

**Mintlify requires Node.js 18–22 (LTS).** It does **not** support Node 25+ (`mint dev` will error).

```bash
cd connect-sdk-docs

# If you use nvm:
nvm install   # reads .nvmrc (22)
nvm use

npm install
npm run docs:dev
```

With **fnm:** `fnm use` (reads `.nvmrc`). With **Homebrew:** `brew install node@22` and ensure that `node` is first on your `PATH`.

```bash
npm install
npm run docs:dev
```

### Deploy to docs.handcash.io

1. Connect this repo (or a mirror) in the [Mintlify dashboard](https://dashboard.mintlify.com) as the docs project for `docs.handcash.io`.
2. Set the **root** to this directory (where `docs.json` lives).
3. **Redirects:** Point old URLs to the new paths, for example:
   - `v2/handcash-connect/send-item` → `/connect/items#transfer-items`
   - `v2/handcash-connect/manage-items` → `/connect/items#lock-and-unlock`
   - `v2/handcash-connect/burn-item` → `/connect/minting-and-burn`
   - `v2/handcash-connect/burn-and-create` → `/connect/minting-and-burn`
   - `v2/handcash-connect/collection-management` → `/connect/collections`
   - `v2/handcash-connect/friends` → `/connect/friends`
4. Remove or archive v2 pages that claim “v3 does not support this yet.”

## Related

- **npm:** [`@handcash/sdk`](https://www.npmjs.com/package/@handcash/sdk)
- **OpenAPI:** [cloud.handcash.io/sdk-docs](https://cloud.handcash.io/sdk-docs/)
