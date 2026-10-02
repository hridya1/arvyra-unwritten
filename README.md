# ARVYRA storefront

Streetwear collection preview with tees, hoodies, cargos, a ghost mannequin 3D T-shirt, colour choices, product details and a draft shopping bag.

**Checkout is disabled.** This project is a brand/storefront preview. No payments or orders are processed.

## Where to edit

- `dist/catalogue.js`: products, collections, prices, sizes, colours and the featured 3D garment.
- `dist/assets/`: product photos, 3D model and artwork.
- `dist/index.html`: page wording and structure.
- `dist/styles.css` and `dist/store.css`: design.

Start with [Adding a collection](docs/ADDING-COLLECTIONS.md).

## Preview locally

Install Node.js 22 or newer, then open a terminal in this folder:

```sh
npm run check
npm start
```

Open `http://127.0.0.1:4174`. There are no npm dependencies to install.

## Deploy with Cloudflare Pages

Use a **Git-connected Pages project** so future GitHub commits deploy automatically. A private GitHub repository is supported; the deployed website can still be public.

1. Push this folder to a GitHub repository on branch `main`.
2. In Cloudflare: **Workers & Pages > Create application > Pages > Connect to Git**.
3. Authorize Cloudflare to access this repository, then select it.
4. Use these settings:

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Production branch | `main` |
| Root directory | Repository root (leave blank) |
| Build command | `npm run check` |
| Build output directory | `dist` |

5. Select **Save and Deploy**. Cloudflare will provide your public URL when deployment succeeds.

Every push to `main` triggers a new check and deployment. Other branches can get preview links. The GitHub Actions workflow also checks product data, images and JavaScript syntax.

Official setup: https://developers.cloudflare.com/pages/get-started/git-integration/

Free-plan limits: https://developers.cloudflare.com/pages/platform/limits/

GitHub Pages is not the hosting target for this commercial storefront.

## Important details

- Do not upload passwords, tokens, `.env` files or your previous Sites repository credentials.
- The `.openai` hosting metadata and original Git history are intentionally excluded from this standalone export.
- `commerce.js` contains a disabled Shopify Storefront adapter. It needs a real store, verified variant IDs and complete checkout testing before it can accept purchases. Never put an Admin API secret in browser code.
- Product artwork and garments are concepts. Confirm prices, materials, measurements and delivery terms before selling.
- Third-party model and library credits/licenses are retained in `dist/assets` and `dist/vendor`. This export does not grant an open-source license to the ARVYRA brand or its artwork.
