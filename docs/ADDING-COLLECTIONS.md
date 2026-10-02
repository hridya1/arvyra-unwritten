# Add a future collection

**Product data lives in `src/lib/catalogue.ts`.** Collections appear automatically from product entries.

1. Upload the photos to `public/assets` in GitHub. Use WebP files named `product-id-colour.webp`, for example `night-city-tee-black.webp` and `night-city-tee-ivory.webp`. Changing a JPG extension does not convert it.
2. Open `src/lib/catalogue.ts`, select the pencil, and add an entry to `products`. Put a comma after the preceding entry.

```ts
{
  id: 'night-city-tee',
  name: 'Night City',
  type: 'Tees',
  collection: 'SUMMER 002',
  price: 2190,
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colours: ['black', 'ivory'],
  sheet: 'tee',
  row: 0,
  description: 'Your product description.'
}
```

3. Commit to `main`. The production build checks the data and images. A connected Vercel Git integration then deploys it; otherwise ask Codex to deploy the update.

Use a unique lowercase ID with hyphens. Price is a number in rupees. Supported categories are `Tees`, `Hoodies`, `Cargos`; supported colours are `black`, `ivory`, `burgundy`, `olive`. Every available colour needs a matching photo. Sizes must be strings, including cargo waist sizes such as `'32'`.

A new category or colour needs corresponding TypeScript type and 3D support changes. The current viewer gives new products the category's concept shape. It does not automatically convert photos or new artwork into a manufacture-matched 3D model. Ask Codex to add a specific 3D garment or map your transparent print in `src/lib/garment-engine.ts`.

After deployment check the product page, photos, 3D, colours, sizes, bag and demo checkout. The homepage's featured product is chosen in `featuredGarment.productId`.

There is no admin dashboard yet. Editing sample prices does not establish real inventory or enable payments. The checkout remains an explicitly labelled simulation until a real commerce service is integrated.