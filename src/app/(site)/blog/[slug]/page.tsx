import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import QuoteCta from "@/components/QuoteCta";
import RichText from "@/components/RichText";
import { formatPostDate, getPost, getPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { CANONICAL_URL, SITE_NAME, canonicalUrl } from "@/lib/site";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return buildMetadata({
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    path: `/blog/${post.slug}/`,
    image: post.image?.src,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const others = getPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    url: canonicalUrl(`/blog/${post.slug}/`),
    ...(post.image ? { image: `${CANONICAL_URL}${post.image.src}` } : {}),
    publisher: { "@type": "Organization", name: SITE_NAME, url: `${CANONICAL_URL}/` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero eyebrow="Dog Care Blog" title={post.title} image={post.image?.src}>
        <p className="eyebrow mt-6 text-white/80">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        </p>
      </PageHero>
      <article className="mx-auto max-w-3xl px-4 py-16 lg:py-24">
        <RichText html={post.html} />
        <p className="mt-12">
          <Link href="/blog/" className="link-underline text-[15px] font-semibold">
            ← All posts
          </Link>
        </p>
      </article>
      {others.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1600px] px-4 py-16 lg:px-8">
            <h2 className="headline text-5xl">More from the blog</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}/`} className="group block">
                    <p className="eyebrow text-[11px] text-muted">{formatPostDate(p.date)}</p>
                    <h3 className="headline mt-2 text-2xl text-deep group-hover:text-teal">{p.title}</h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <QuoteCta />
    </>
  );
}
