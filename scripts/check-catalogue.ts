import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { products, colours, imageFor, featuredGarment } from '../src/lib/catalogue';
const ids = new Set<string>();
for (const product of products) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.id) || ids.has(product.id)) throw new Error(`Invalid or duplicate product ID: ${product.id}`);
  ids.add(product.id);
  if (!product.name || !product.description || !product.collection || !['Tees', 'Hoodies', 'Cargos'].includes(product.type)) throw new Error(`Incomplete product: ${product.id}`);
  if (!Number.isInteger(product.price) || product.price <= 0) throw new Error(`Invalid price: ${product.id}`);
  if (!product.sizes.length || new Set(product.sizes).size !== product.sizes.length) throw new Error(`Invalid sizes: ${product.id}`);
  if (!product.colours.length || new Set(product.colours).size !== product.colours.length) throw new Error(`Invalid colours: ${product.id}`);
  for (const colour of product.colours) if (!colours[colour] || !existsSync(resolve('public', '.' + imageFor(product, colour)))) throw new Error(`Missing image: ${product.id}/${colour}`);
}
for (const path of [featuredGarment.model, featuredGarment.artwork]) if (!existsSync(resolve('public', '.' + path))) throw new Error(`Missing 3D asset: ${path}`);
if (!ids.has(featuredGarment.productId)) throw new Error('Unknown featured product');
console.log(`Catalogue verified: ${products.length} products, all images and 3D assets present.`);
