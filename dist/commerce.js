// Public Storefront API credentials only. Never put Admin API credentials here.
// Set enabled only after real products/variants/prices are verified in Shopify.
export const commerce={enabled:false,shopDomain:'',publicStorefrontToken:'',apiVersion:'2026-01',variantIds:{}};
export async function createCheckout(lines){
 if(!commerce.enabled)throw new Error('Checkout is not open yet. No order has been placed.');
 if(!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(commerce.shopDomain))throw new Error('Store configuration is incomplete.');
 const items=lines.map(line=>{const merchandiseId=commerce.variantIds[`${line.id}|${line.colour}|${line.size}`];if(!merchandiseId)throw new Error('A selected size or colour is not available for checkout yet.');return {merchandiseId,quantity:line.quantity};});
 const response=await fetch(`https://${commerce.shopDomain}/api/${commerce.apiVersion}/graphql.json`,{method:'POST',headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':commerce.publicStorefrontToken},body:JSON.stringify({query:'mutation CreateCart($input: CartInput!) { cartCreate(input: $input) { cart { checkoutUrl } userErrors { message } } }',variables:{input:{lines:items,buyerIdentity:{countryCode:'IN'}}}})});
 if(!response.ok)throw new Error('Checkout could not be reached. Your bag is unchanged.');const data=await response.json();const errors=data.errors||data.data?.cartCreate?.userErrors;if(errors?.length)throw new Error('The store could not create checkout. Please check availability and try again.');const url=data.data?.cartCreate?.cart?.checkoutUrl;if(!url||new URL(url).protocol!=='https:')throw new Error('Checkout is unavailable. Your bag is unchanged.');return url;
}
