import posts from "@/content/blog-posts.json";

/**
 * Blog posts carried over from the WordPress site (www.cooldogwashtubs.com),
 * stored with the site: the CMS's storefront API has no posts. The theme's
 * lorem-ipsum demo posts were left out and redirect to /blog/ (next.config.ts).
 */
export type BlogPost = {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  excerpt: string;
  image: { src: string; alt: string } | null;
  /** Cleaned HTML (paragraphs, headings, lists, links, images). */
  html: string;
};

const ALL = posts as BlogPost[];

/** Newest first. */
export const getPosts = (): BlogPost[] => ALL;

export const getPost = (slug: string): BlogPost | undefined => ALL.find((p) => p.slug === slug);

export const formatPostDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
