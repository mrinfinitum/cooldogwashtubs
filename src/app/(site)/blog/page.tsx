import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import QuoteCta from "@/components/QuoteCta";
import { formatPostDate, getPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { media } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Dog Care Blog | Cool Dog Wash Tubs",
  description:
    "Tips on dog grooming, coat and paw care, dental health, nutrition and exercise from Cool Dog Wash Tubs.",
  path: "/blog/",
  image: media("dog-wash-tubs-header2.jpg"),
});

export default function BlogIndex() {
  const posts = getPosts();
  return (
    <>
      <PageHero eyebrow="Dog Care Blog" title="Happy, healthy dogs" image={media("dog-wash-tubs-header2.jpg")} />
      <section className="mx-auto max-w-[1600px] px-4 py-16 lg:px-8 lg:py-24">
        <h2 className="sr-only">All posts</h2>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}/`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden bg-mist">
                  {post.image && (
                    <Image
                      src={post.image.src}
                      alt={post.image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="eyebrow mt-5 text-[11px] text-muted">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                </p>
                <h3 className="headline mt-2 text-3xl text-ink group-hover:text-teal">{post.title}</h3>
                <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <QuoteCta />
    </>
  );
}
