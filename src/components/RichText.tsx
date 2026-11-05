/** Widths the image optimizer serves (Next's default device sizes) for images inside rich text. */
const WIDTHS = [640, 828, 1080, 1200];
const CMS_ORIGIN = process.env.CMS_URL ? new URL(process.env.CMS_URL).origin : "";

/**
 * Images in CMS text (blog posts, product descriptions) get resized, modern-format
 * versions through the site's image optimizer, and load lazily.
 */
function optimizeImages(html: string) {
  return html.replace(/<img\b([^>]*)>/gi, (tag, attrs: string) => {
    const src = attrs.match(/\ssrc="([^"]+)"/i)?.[1];
    if (!src || /\ssrcset=/i.test(attrs)) return tag;
    const local = src.startsWith("/media/");
    const cms = CMS_ORIGIN && src.startsWith(`${CMS_ORIGIN}/wp-content/uploads/`);
    if (!(local || cms) || !/\.(?:jpe?g|png|webp)$/i.test(src)) return tag;
    const url = (w: number) => `/_next/image/?url=${encodeURIComponent(src)}&amp;w=${w}&amp;q=75`;
    const srcset = WIDTHS.map((w) => `${url(w)} ${w}w`).join(", ");
    const extra = [
      `srcset="${srcset}"`,
      `sizes="(min-width: 768px) 720px, 100vw"`,
      /\sloading=/i.test(attrs) ? "" : `loading="lazy"`,
      /\sdecoding=/i.test(attrs) ? "" : `decoding="async"`,
    ].filter(Boolean);
    return `<img${attrs.replace(/\s*\/$/, "")} ${extra.join(" ")}>`;
  });
}

/**
 * Renders rich text from the CMS (HTML produced by WordPress) with the site's
 * content styles. The HTML comes from our own CMS through an authenticated API.
 */
export default function RichText({ html, className = "" }: { html: string; className?: string }) {
  if (!html?.trim()) return null;
  return <div className={`wp-content ${className}`} dangerouslySetInnerHTML={{ __html: optimizeImages(html) }} />;
}
