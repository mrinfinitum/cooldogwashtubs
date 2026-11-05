// Site-wide settings. Content lives in the Headless Commerce CMS (WordPress); checkout runs on Stripe.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cooldogwashtubs.com"
).replace(/\/$/, "");

/**
 * The one address search engines should index: https, www, trailing slash
 * (apex and http redirect here at Vercel). Canonical tags, og:url, the sitemap,
 * robots.txt, structured data and llms.txt always use it, even on previews and
 * locally, so every copy of a page points at the production URL. SITE_URL stays
 * the address of the environment you're on (emails, Stripe return links).
 */
export const CANONICAL_URL = "https://www.cooldogwashtubs.com";

/** The canonical absolute URL for a site path ("/shop/" → "https://www…/shop/"). */
export const canonicalUrl = (path: string) => `${CANONICAL_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const SITE_NAME = "Cool Dog Wash Tubs";

export const CONTACT = {
  phone: "800.931.1562",
  phoneHref: "tel:8009311562",
  fax: "800.931.6152",
  email: "sales@gymsfordogs.com",
  hours: "8:00 AM – 5:00 PM EST",
  days: "Monday – Friday",
};

/** White-text logo for dark backgrounds (footer). */
export const LOGO_LIGHT = {
  src: "/media/cool-dog-wash-tubs-logo-light-main.png",
  width: 500,
  height: 181,
};

/** Header logo (dark text). */
export const LOGO = {
  src: "/media/cooldogwashtubs_logo-1.png",
  width: 799,
  height: 272,
};

/** Design images and media stored with the site in /public/media/. */
export const media = (file: string) => `/media/${file}`;

export const COMPANY_LINKS = [
  { href: "/contact-us/", label: "Contact Us" },
  { href: "/wishlist/", label: "Wishlist" },
  { href: "/account/", label: "My Account" },
];

export const LEGAL_LINKS = [
  { href: "/privacy-policy/", label: "Privacy Policy" },
  { href: "/cookie-policy/", label: "Cookie Policy" },
];
