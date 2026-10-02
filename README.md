# ARVYRA — Next.js demo store

A personal streetwear design experiment built with Next.js App Router, React, TypeScript, Three.js and Zod. Concept garments are not for sale.

## What works

- Search, categories, collection filters and price sorting.
- Seven product pages, each with interactive 3D and photo views, colour selection and sizes.
- Browser-tab shopping bag with validated restoration, quantity limits and totals.
- Server-validated demo checkout and a clearly labelled simulation confirmation.
- Mobile layouts, reduced motion, keyboard view controls and product-image fallback when WebGL fails.
- Product metadata, sitemap, robots rules, 404 handling and browser security headers.

## Run locally

Use Node.js 22 and run:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For the production build:

```sh
npm run build
npm start
```

`npm run check` verifies the catalogue, TypeScript and meaningful cart validation tests. GitHub Actions runs the full production build.

## Edit the store

- `src/lib/catalogue.ts`: products, collections, colours, sample prices and hero product.
- `public/assets`: photos, tee model, print and asset credits.
- `src/lib/garment-engine.ts`: 3D scene, garment geometry and graphics.
- `src/components`: React storefront, product controls, bag and demo checkout.
- `src/app`: pages, metadata and the demo checkout API.

See [Adding collections](docs/ADDING-COLLECTIONS.md).

## Deployment

The Vercel project is `arvyra-unwritten`; its production domain is https://arvyra-unwritten.vercel.app. `vercel.json` selects Next.js and the production build. Keep the repository root as the project root; remove any old `dist` output override from the hosting settings.

Git-based automatic deployments require the owner's GitHub connection in Vercel and a linked repository. A successful command-line deployment does not by itself enable automatic updates. Check that connection before assuming a push updates the public site.

This remains a personal non-commercial prototype on Hobby. Vercel defines commercial use to include advertising products for sale, even before processing payments: https://vercel.com/docs/limits/fair-use-guidelines

## Before a real retail launch

This demo is deployable, but it is not a production commerce backend. It has no real stock, payment processing, shipping/tax calculations, customer accounts, emails or durable order records. The demo receipt is only saved in the browser tab.

Connect a real commerce system such as Shopify, use its verified variants/prices/stock and hosted checkout, test payment failures and stock changes, and establish shipping, returns, privacy and support details before accepting orders. Choose hosting suitable for commercial use.

All 3D models are illustrative. The tee uses an authored ghost-mannequin mesh; hoodie and cargo shapes are procedural design concepts, not scanned garments. Some prints use placement studies rather than exact production artwork. Product photographs remain the design reference. A manufacture-matched fit needs authored garment models and actual measurements.

Third-party model credits and licenses are retained in `public/assets`. ARVYRA branding and artwork are not granted an open-source license by this repository.