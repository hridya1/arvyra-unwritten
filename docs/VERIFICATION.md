# Upgrade verification

Validated on 3 October 2026 (India time) against a local production build.

- Next.js production compilation and strict TypeScript checks passed.
- Five cart validation tests passed: server price calculation, altered-price rejection, invalid variants/quantities, duplicate-variant limit and oversized/empty carts.
- All seven product pages loaded interactive 3D; colour switching, front/back controls and photo/3D remounting passed.
- Search, category filters, required sizes, quantities, bag arithmetic and restoration passed.
- The browser completed server order review and the demo confirmation; the bag cleared afterwards.
- An API request including a forged price returned 400. Unknown product URLs returned 404.
- Home, product and bag pages had no horizontal overflow at 360px, 390px and 768px widths.
- Reduced motion, loaded product images, and no browser script errors or broken requests were confirmed.
- `npm audit --omit=dev` reported zero known vulnerabilities at verification time.

Checks used a headless Edge browser and simulated viewport sizes, not physical phones. They do not establish real-payment, inventory, delivery, accessibility certification, load capacity or manufacture-matched 3D accuracy. The store remains a personal demo.
