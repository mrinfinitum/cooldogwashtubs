import type { NextConfig } from "next";

// Product and page photos are served from the CMS's media library.
const cms = new URL(process.env.CMS_URL || "https://cms.thedogparkcompany.com");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Keep the old WordPress-style URLs (/page-name/) so links and rankings carry over.
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: cms.hostname, pathname: "/wp-content/uploads/**" },
    ],
  },
  // Previews (dev.cooldogwashtubs.com and branch deploys) are never indexed.
  async headers() {
    return process.env.VERCEL_ENV === "production"
      ? []
      : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  async redirects() {
    return [
      // Old WooCommerce URLs.
      { source: "/product-tag/:tag*", destination: "/shop/", permanent: true },
      { source: "/my-account/:path*", destination: "/account/", permanent: true },
      { source: "/wishlist-2/", destination: "/wishlist/", permanent: true },
      // The WordPress site had separate left/right plumbing pages; the CMS has one
      // product per tub with a plumbing-side option.
      ...Object.entries({
        "dog-wash-standard-series-48-w-lsp": "the-cool-dog-standard-series-dog-wash-station-48-w",
        "dog-wash-standard-series-48-w-rsp": "the-cool-dog-standard-series-dog-wash-station-48-w",
        "dog-wash-standard-series-60-w-lsp": "the-cool-dog-standard-series-dog-wash-station-60-w",
        "dog-wash-standard-series-60-w-rsp": "the-cool-dog-standard-series-dog-wash-station-60-w",
        "dog-wash-tub-pro-series-tub-lsp": "dog-wash-tub-pro-series-parallel-access-tub",
        "dog-wash-tub-pro-series-tub-rsp": "dog-wash-tub-pro-series-parallel-access-tub",
        "dog-wash-tub-pro-series-perpendicular-access-tub-lsp": "dog-wash-tub-pro-series-perpendicular-access-tub",
        "dog-wash-tub-pro-series-perpendicular-access-tub-rsp": "dog-wash-tub-pro-series-perpendicular-access-tub",
        "cool-dog-wash-tub-safety-steps": "cool-dog-wash-tub-architectural-series-safety-steps",
      }).map(([from, to]) => ({ source: `/dog-park/${from}/`, destination: `/dog-park/${to}/`, permanent: true })),
      // Category pages: the shop lists every product.
      { source: "/product-category/:path*", destination: "/shop/", permanent: true },
      // Old WordPress admin: content is now edited in the Headless Commerce CMS.
      { source: "/wp-admin/:path*", destination: `${cms.origin}/wp-admin/`, permanent: false },
      { source: "/wp-login.php", destination: `${cms.origin}/wp-admin/`, permanent: false },
      // Old WordPress media links (images now live in the CMS).
      { source: "/wp-content/:path*", destination: "/", permanent: true },
    ];
  },
  turbopack: {
    // A stray package-lock.json in the home folder would otherwise be picked as the root.
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
