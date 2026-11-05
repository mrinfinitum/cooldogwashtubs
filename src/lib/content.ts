import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { cms } from "./cms";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Seo = {
  title?: string;
  description?: string;
  focusKeyphrase?: string;
  noindex?: boolean;
};

export type ProductImage = { src: string; alt: string };

/**
 * One option (variation) of a product. `color` holds the option's value,
 * whatever the option is: a color ("Blue") or e.g. a plumbing side
 * ("Right Side Plumbing"); the cart and checkout pass it through as-is.
 */
export type ColorOption = {
  id: string;
  color: string;
  /** This color's SKU (the product SKU when none is set). */
  sku: string;
  swatch?: string;
  /** Prices in cents: Contractor Price (what the shopper pays) and Commercial List Price. */
  price: number;
  regularPrice: number;
  inStock: boolean;
  /** The product photographed in this color. */
  image?: ProductImage;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  summary: string;
  /** Rendered HTML from the CMS. */
  descriptionHtml: string;
  /** Prices in cents: Contractor Price (what the shopper pays) and Commercial List Price. */
  price: number;
  regularPrice: number;
  onSale: boolean;
  priceLabel?: string;
  inStock: boolean;
  images: ProductImage[];
  categories: { slug: string; name: string; isSeries: boolean }[];
  colors: string[];
  options: ColorOption[];
  /** What the options are, e.g. "Color" or "Plumbing Side". */
  optionLabel: string;
  /** True when the options are colors (shown as swatches). */
  optionIsColor: boolean;
  /** Spec sheets, CAD drawings and guides uploaded in the CMS. */
  downloads: Download[];
  taxCode: string;
  seo: Seo;
};

export type Download = { label: string; url: string; filename: string; type: string; size: number | null };

export type Page = {
  id: string;
  slug: string;
  title: string;
  /** Rendered HTML from the CMS. */
  html: string;
  heroImage?: string;
  modified: string;
  seo: Seo;
};

/* ------------------------------------------------------------------ */
/* Headless Commerce CMS API (WordPress + WooCommerce)                 */
/* ------------------------------------------------------------------ */

type RawImage = { src: string; alt: string; width: number | null; height: number | null } | null;

type RawProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  summary: string;
  descriptionHtml: string;
  /** Cents. */
  listPrice: number | null;
  contractorPrice: number | null;
  price: number | null;
  priceLabel: string | null;
  inStock: boolean;
  images: RawImage[];
  categories: { slug: string; name: string; isSeries: boolean }[];
  attributes: { name: string; slug: string; values: { name: string; swatch: string | null }[] }[];
  options: {
    id: string;
    sku: string;
    color: string | null;
    attributes?: Record<string, string>;
    price: number | null;
    listPrice: number | null;
    inStock: boolean;
    image: RawImage;
  }[];
  downloads?: Download[];
  taxCode: string;
  order: number;
  seo: Seo;
};

type RawPage = {
  id: string;
  slug: string;
  title: string;
  html: string;
  heroImage: RawImage;
  modified: string;
  seo: Seo;
};

const image = (img: RawImage | undefined, fallbackAlt: string): ProductImage | undefined =>
  img?.src ? { src: img.src, alt: img.alt || fallbackAlt } : undefined;

function mapProduct(p: RawProduct): Product {
  const price = p.price ?? 0;
  const regularPrice = Math.max(p.listPrice ?? price, price);
  const swatches = new Map(
    (p.attributes.find((a) => a.slug === "color")?.values ?? []).map((v) => [v.name, v.swatch]),
  );
  // Options are colors when the product has them, otherwise its first option
  // group (e.g. wash tubs: Plumbing Side).
  const optionIsColor = p.options.some((o) => o.color);
  const optionKey = optionIsColor ? "color" : Object.keys(p.options[0]?.attributes ?? {})[0];
  const optionLabel =
    p.attributes.find((a) => a.slug === optionKey)?.name ?? (optionIsColor ? "Color" : "Option");
  const options = p.options
    .map((o) => ({ o, value: optionIsColor ? o.color : optionKey ? o.attributes?.[optionKey] : null }))
    .filter((x): x is { o: RawProduct["options"][number]; value: string } => Boolean(x.value))
    .map(({ o, value }) => {
      const optionPrice = o.price ?? price;
      return {
        id: o.id,
        color: value,
        sku: o.sku || p.sku,
        swatch: optionIsColor ? (swatches.get(value) ?? undefined) : undefined,
        price: optionPrice,
        regularPrice: Math.max(o.listPrice ?? optionPrice, optionPrice),
        inStock: o.inStock,
        image: image(o.image, `${p.name} – ${value}`),
      };
    });
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    summary: p.summary,
    descriptionHtml: p.descriptionHtml,
    price,
    regularPrice,
    onSale: regularPrice > price,
    priceLabel: p.priceLabel ?? undefined,
    inStock: p.inStock,
    images: p.images.flatMap((img) => image(img, p.name) ?? []),
    categories: p.categories,
    colors: optionIsColor ? options.map((o) => o.color) : [],
    options,
    optionLabel,
    optionIsColor,
    downloads: p.downloads ?? [],
    taxCode: p.taxCode,
    seo: p.seo,
  };
}

const byOrderThenName = (a: { order: number; name: string }, b: { order: number; name: string }) =>
  a.order - b.order || a.name.localeCompare(b.name);

/* ------------------------------------------------------------------ */
/* Data access (cached; refreshed when the CMS posts to /api/revalidate) */
/* ------------------------------------------------------------------ */

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("cms", "products");
  const raw = await cms<RawProduct[]>("products");
  return raw.sort(byOrderThenName).map(mapProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? getUnlistedProduct(slug);
}

/**
 * A product hidden from the catalog listing (like the CMS's $1 checkout test)
 * that the CMS still serves by slug: reachable by direct link, never in the shop.
 */
async function getUnlistedProduct(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("cms", "products");
  if (!/^[a-z0-9-]{1,200}$/.test(slug)) return null;
  const raw = await cms<RawProduct>(`products/${slug}`).catch(() => null);
  if (!raw?.slug) return null;
  return mapProduct({ ...raw, seo: { ...raw.seo, noindex: true } });
}

/** Pages with their own routes rather than the generic page template. */
export const RESERVED_PAGE_SLUGS = new Set(["contact-us"]);

/** CMS pages that aren't shown as pages on this site. */
export const RETIRED_PAGE_SLUGS = new Set<string>(["success"]);

/** The site's pages (retired ones excluded). */
export async function getPages(): Promise<Page[]> {
  return (await getAllPages()).filter((p) => !RETIRED_PAGE_SLUGS.has(p.slug));
}

/** Every published CMS page, including retired ones. */
export async function getAllPages(): Promise<Page[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("cms", "pages");
  const raw = await cms<RawPage[]>("pages");
  return raw.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    html: p.html,
    heroImage: p.heroImage?.src,
    modified: p.modified,
    seo: p.seo,
  }));
}

export async function getPage(slug: string): Promise<Page | null> {
  const pages = await getPages();
  return pages.find((p) => p.slug === slug) ?? null;
}
