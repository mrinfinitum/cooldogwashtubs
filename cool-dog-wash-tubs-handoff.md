# Handoff: Cool Dog Wash Tubs storefront

A new storefront that reads from the same Headless Commerce CMS as Cool Dog Water Fountains.
Written 2026-11-04 from the Cool Dog Water Fountains repo (`~/Projects/cooldogwaterfountains`, commit `923b767`).

## The short version

Copy the Cool Dog Water Fountains app and change its branding and product details.
That app already handles:

- catalog and pages from the CMS
- the cart, Stripe checkout and PO orders
- shared customer accounts
- order and shipping emails through Resend
- cache refresh when the CMS changes

Each of these is tied to its storefront by an API key and a secret. None of them hard-codes a store, except for the places listed under "Change for Wash Tubs" below.

Don't trust the reference repo's `README.md`. It still describes Sanity, which was retired on 2026-11-03.
Treat the code and this note as current.

## Stack (match it)

- **Next.js 16.4.3**: `cacheComponents: true`, `partialPrefetching: true`, `trailingSlash: true`, Turbopack, React 19.3.
  - APIs differ from older Next. Read `node_modules/next/dist/docs/` before writing code.
  - The Image `priority` prop is retired. Use `preload` or `fetchPriority="high"`.
- **Tailwind v4** through `@tailwindcss/turbopack`. The rule is in `next.config.ts` under `turbopack.rules`.
- **Hosting:** Vercel.
  - `dev` is the preview branch and sits behind Vercel sign-in.
  - `main` is production.
  - Merge to main only when the owner says "go live".
- **Dependencies:** `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`, `@next/third-parties` (GA4) and `server-only`. There is no CMS SDK; it's plain `fetch`.

## The CMS

- **Address:** `https://cms.thedogparkcompany.com`. This is WordPress + WooCommerce on Pressable, with the `headless-commerce` plugin (currently 0.9.1).
- **Where CMS work happens:** its own repo and session at `~/Projects/headless-commerce-cms`. Its README has the full API.
- **API:** `GET {CMS_URL}/wp-json/headless/v1/...` with `Authorization: Bearer <storefront API key>`. Prices are in cents.
  - The key decides which storefront is calling. Each store only sees the products, pages and categories ticked for it, and its orders are tagged to it.

| Request | Used for |
| --- | --- |
| `GET products` · `products/<slug>` | Catalog: options/colors, SKUs, `listPrice` (Commercial List), `contractorPrice` / `price` (what the shopper pays), images, downloads, `taxCode`, SEO, sort `order` |
| `GET categories` | The storefront's categories (series flag, home tiles) |
| `GET pages` · `pages/<slug>` | Content pages (rendered HTML, hero image, SEO) |
| `POST orders` | Records a paid Stripe session or a PO order. Idempotent: it reduces stock and WooCommerce emails the store |
| `GET orders/<id>` | One of this storefront's orders (used by order-event emails) |
| `POST customers/register` · `customers/login` · `customers/password` | Accounts, shared across every storefront |
| `GET/POST customers/<id>` · `customers/<id>/orders` · `customers/<id>/saved` | My Account: profile, order history, saved products |

### What the CMS calls on the storefront

Both calls send the header `x-revalidate-secret: <REVALIDATE_SECRET>`.

- `POST <site>/api/revalidate/` runs on any catalog or page change. The route runs `revalidateTag("cms", "max")`.
- `POST <site>/api/order-events/` sends `{ orderId, event: "shipped" | "tracking" }` when sales completes an order or adds tracking. The storefront then reads the order and emails the customer in its own name.

### CMS setup for the new store

The owner does these steps in wp-admin, or they go to the CMS session:

1. Go to **Products → Storefronts** and add "Cool Dog Wash Tubs".
2. Set its **website address**: the production domain, or the dev URL while testing.
3. Set its **refresh secret** to the same value as `REVALIDATE_SECRET`.
4. Copy the **API key** into `CMS_API_KEY`. The key is shown only once.
5. Tick the new storefront on each wash-tub **product**, **page** and **category**.
6. Optionally, fill in the per-storefront SEO in the "Storefront SEO" box.

Don't rebuild the merged catalog. `scripts/build-catalog.mjs` deliberately stops with an error. If wash-tub products need importing, import them on their own.

## Environment variables

Mirror the reference repo's `.env.example`, with values for this site.
Never commit `.env.local`.

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | This site's public address (canonical URLs, sitemap, Stripe return URL) |
| `CMS_URL` | `https://cms.thedogparkcompany.com` (a staging CMS was used locally at one point) |
| `CMS_API_KEY` | The new storefront's key (step 4 above) |
| `REVALIDATE_SECRET` | New random value, the same as the storefront's refresh secret in the CMS |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | The Stripe account is **shared** with the other stores. Use test keys until launch |
| `STRIPE_WEBHOOK_SECRET` | From a **new** webhook endpoint `<site>/api/stripe/webhook/` (events `checkout.session.completed` and `checkout.session.async_payment_succeeded`) |
| `RESEND_API_KEY`, `QUOTE_FROM_EMAIL` | Resend's verified sending domain is `send.thedogparkcompany.com`, e.g. `Cool Dog Wash Tubs <quotes@send.thedogparkcompany.com>` |
| `SESSION_SECRET` | New, 32+ random characters (signs the My Account cookie) |
| `NEXT_PUBLIC_GA_ID` | A new GA4 property. Set it in Vercel **Production only** |

## Copy as-is (works for any storefront)

From `src/`:

- `lib/cms.ts`: the fetch wrapper. `CmsError` shows customers the CMS's own message for `hc_*` errors.
- `lib/cms-secret.ts`: the timing-safe check of `x-revalidate-secret`.
- `lib/content.ts`: types plus `getProducts` and `getAllPages`.
  - These use `"use cache"`, `cacheLife("hours")` and `cacheTag("cms", "products" | "pages")`.
  - Remove the Water Fountains `RETIRED_PAGE_SLUGS` and `RESERVED_PAGE_SLUGS` entries.
- `lib/pricing.ts`: re-prices the cart from the CMS on the server and refuses missing, out-of-stock or unknown-color items. Browser prices are never trusted.
- `lib/session.ts`, `lib/account*.ts`, `app/api/account/*` and `app/(site)/account/*`: accounts that are shared across stores through the CMS.
- `lib/email.ts`: Resend over `fetch` with idempotency keys.
- Other API routes:
  - `app/api/revalidate`
  - `app/api/order-events`
  - `app/api/po-order`: pay by invoice/PO, recorded as an On-hold order.
  - `app/api/download`: streams CMS uploads with "save as" headers, limited to `/wp-content/uploads/`.
- Cart: `lib/cart.ts` (in the browser) and `components/cart/*`.
- `app/api/checkout` plus `app/api/stripe/webhook`: embedded Stripe Checkout.
  - Card only, Stripe Tax on, US shipping only.
  - Shipping is 12% of the order, taxed with code `txcd_92010001` (see `lib/format.ts` and `lib/stripe.ts`).
  - The webhook posts the paid order to the CMS and then emails the customer.
- SEO and other files:
  - `lib/seo.ts` (metadata falls back to content when the CMS SEO is empty)
  - `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt`
  - Product and Organization JSON-LD
  - the `X-Robots-Tag: noindex` header on every environment except production (`next.config.ts`)

## Change for Wash Tubs

- **Stripe source tag (important).** The Stripe account is shared, and the webhook ignores any session whose `metadata.source` isn't its own.
  - Change `"cooldogwaterfountains.com"` in **both** `app/api/checkout/route.ts` and `app/api/stripe/webhook/route.ts` to the new domain.
- **`lib/site.ts`:**
  - `SITE_NAME`, the logos, the hero media
  - `CONTACT` (currently phone 800.931.1562 and sales@gymsfordogs.com; confirm with the owner)
  - the menus `RESOURCE_LINKS`, `COMPANY_LINKS` and `LEGAL_LINKS`
- **`lib/email.ts`:** the `QUOTE_FROM_EMAIL` fallback name and the `SALES_RECIPIENTS` / `ORDER_RECIPIENTS` lists.
- **Session cookie names** in `lib/session.ts` (`cd_session`, `cd_signed_in`): rename them, e.g. `cdwt_`. Cookies are per domain anyway, but distinct names avoid confusion.
- **`next.config.ts`:** drop every Water Fountains redirect, including the old WordPress ones, unless Wash Tubs has an old site with URLs to keep.
- **Product route:** `/fountain/[slug]/` becomes whatever fits, e.g. `/wash-tub/[slug]/`.
  - Update `ProductCard` links, the sitemap and the JSON-LD to match.
- **Fountain-only pieces to drop or replace:**
  - planning sheets: `components/sheets/*`, `lib/sheets*.ts`, `app/api/sheets`, `app/print/sheet`, `scripts/build-sheets.mjs`, `public/downloads/`
  - `lib/colors.ts` (Color Play swatches), if tubs don't come in colors
  - the home page's FEATURES / COLOR_CHIPS
  - `scripts/photos`
- **Visual design:** reuse the layout system, but give it its own palette and assets in `public/media/`.

## Lessons from the Water Fountains build

- **Images:** CMS images need `images.remotePatterns` for `cms.thedogparkcompany.com/wp-content/uploads/**`.
  - Give the hero and above-the-fold images `preload` / `fetchPriority="high"`.
  - The Water Fountains home page scores 96 on mobile Lighthouse with an LCP of 2.7 s. A smaller phone-sized hero would help.
- **Preview limits:** the dev preview sits behind Vercel sign-in, so run Lighthouse on production or locally with `next build && next start`.
- **Product documents** come from the CMS product "Downloads" box (`product.downloads`), shown only when files are attached.
  - A separate docs-library app (docs.thedogparkcompany.com) was planned on 2026-11-03 but was set aside on 2026-11-04 in favour of the CMS box. Check with the owner before building against it.
- **Streaming:** wrap request-time data (e.g. `getSession`, which calls `connection()`) in `<Suspense>`. Under `cacheComponents` a page can't read request data outside a Suspense boundary.

## Open questions for the owner

- Domain name, and is there an old site whose URLs need redirects?
- Which products, categories and pages are wash tubs, and are they already in the CMS?
- Contact phone and email, and who gets order and quote emails?
- Same shipping rule (12%) and same PO/invoice option?
- Is there a new GA4 property?
