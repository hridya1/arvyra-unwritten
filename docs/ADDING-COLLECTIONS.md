# Add a future collection

**You edit one file: `dist/catalogue.js`.** A collection appears automatically when a product uses its new name.

## The easiest way: edit on GitHub

### 1. Upload the product images

Open `dist/assets` in your GitHub repository. Select **Add file > Upload files**.

Use WebP images named with the product ID and colour:

- `night-city-tee-black.webp`
- `night-city-tee-ivory.webp`

Commit the uploaded files to `main` first. If your photos are JPG or PNG, ask Codex to convert them to WebP; changing a filename extension does not convert the image.

### 2. Add the product entry

Open `dist/catalogue.js`, select the pencil icon, and find `export const products=[`.

Add a comma after the current last product, then insert this example before the closing `];`:

```js
{
  id: 'night-city-tee',
  name: 'Night City',
  type: 'Tees',
  collection: 'SUMMER 002',
  price: 2190,
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colours: ['black', 'ivory'],
  description: 'Your product description goes here.'
}
```

Change the example to your actual product. The price is a number in rupees; do not add the rupee symbol inside the value.

- Each `id` must be unique, lowercase and use hyphens.
- `type` currently supports `Tees`, `Hoodies` or `Cargos`.
- `collection` can be a new name. No separate collection page needs to be created.
- The colours must exist in the `colours` section at the top of the file.
- Each listed colour needs its matching product image.
- Use strings for all sizes, including cargo sizes such as `'30'`.

### 3. Commit and check the live website

Save with **Commit changes** to `main`.

Once GitHub and Cloudflare are connected, Cloudflare checks and deploys the update automatically. Wait for a successful deployment in Cloudflare, then refresh the public site.

Verify the new collection filter, colour photos, prices, sizes and bag totals. If a check fails, read its error message and fix the missing file or invalid entry.

## Change an existing product

Edit its existing object in `catalogue.js`. Prices update across cards, product details, homepage links and bag totals. The 3D homepage only follows the product selected in `featuredGarment.productId`.

Changing a colour hex value updates swatches and the 3D material; it does not recolour product photographs. Upload corresponding photos as well.

## Change the homepage 3D shirt

Edit `featuredGarment` near the bottom of `catalogue.js`:

- `productId`: the tee whose price, available colours and shopping link appear in the hero.
- `artwork`: path to the transparent back print.
- `chestMark`: the front lettering.
- `model`: path to the 3D garment file.
- `shape`: width, height and depth scale.

The present viewer expects the T-shirt model's mesh structure. Choosing a hoodie or cargo product does not generate a different model; ask Codex to integrate a compatible 3D garment.

## Prefer to let Codex do it?

Say: **"Add a collection called SUMMER 002"** and provide product photos, names, prices, sizes and colours. Codex can edit, verify and push the update once GitHub is connected.

There is no admin dashboard or stock management system yet. Publishing product changes does not enable payments.
