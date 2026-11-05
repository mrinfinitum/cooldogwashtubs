import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import {
  FlagIcon,
  PaletteIcon,
  RulerIcon,
  ShieldIcon,
  Wave,
  WrenchIcon,
} from "@/components/icons";
import { CONTACT, LOGO, SITE_NAME, CANONICAL_URL, media } from "@/lib/site";
import { getProducts } from "@/lib/content";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Dog Wash Tubs & Dog Bath Tubs, Made in the USA | Cool Dog",
    description:
      "Durable, easy-to-use dog wash tubs and dog bath tubs for groomers, kennels, vet clinics and pet-friendly properties. Standard and Pro Series, made in the USA.",
    path: "/",
    image: media("dog-wash-tubs-header1.jpg"),
  });
}

const FEATURES = [
  {
    icon: FlagIcon,
    title: "Made in the USA",
    text: "Our dog wash tubs are designed and manufactured in the United States.",
  },
  {
    icon: ShieldIcon,
    title: "Quality",
    text: "Built with the highest quality outdoor materials and coatings.",
  },
  {
    icon: WrenchIcon,
    title: "Tub Accessories",
    text: "Steps, grooming tables and dryers that make bathing easier and safer for pets.",
  },
  {
    icon: RulerIcon,
    title: "Architectural Design",
    text: "Intelligently designed and hand crafted using the best materials and ingenuity.",
  },
  {
    icon: PaletteIcon,
    title: "Color Play®",
    text: "A variety of standard colors, plus custom colors to match your space.",
  },
];

export default async function HomePage() {
  const products = await getProducts();

  // Structured data for search engines.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: `${CANONICAL_URL}/`,
      logo: `${CANONICAL_URL}${LOGO.src}`,
      telephone: `+1-${CONTACT.phone.replace(/\./g, "-")}`,
      email: CONTACT.email,
      parentOrganization: { "@type": "Organization", name: "The Dog Park Company" },
    },
    { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: `${CANONICAL_URL}/` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* ---------------- Hero ---------------- */}
      <section className="relative isolate flex min-h-[min(78svh,820px)] items-end overflow-hidden bg-deep text-white lg:min-h-[min(86svh,960px)]">
        <Image
          src={media("dog-wash-tubs-header1.jpg")}
          alt="A wet puppy surrounded by water droplets"
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          quality={60}
          className="-z-20 object-cover object-[78%_center] lg:object-[70%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-deep/35 to-teal/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/55 via-ink/15 to-transparent" />
        <div className="mx-auto w-full max-w-[1600px] px-4 pb-16 lg:px-8 lg:pb-24">
          <p className="eyebrow block text-white">Dog Wash Tubs · Made in the USA</p>
          <h1 className="headline mt-5 block max-w-5xl text-[19vw] sm:text-[8.5rem] lg:text-[11rem]">
            Clean paws{" "}
            <br />
            happy tails
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85">
            Durable, easy-to-use, and perfect for dogs of all sizes — keep your furry friend fresh
            with our premium dog wash tubs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#products" className="btn btn-light">
              Shop Wash Tubs
            </Link>
            <Link
              href="/contact-us/"
              className="btn btn-outline hover:!border-white hover:!bg-white hover:!text-ink"
            >
              Build a Quote
            </Link>
          </div>
        </div>
        <Wave className="absolute -bottom-px left-0 h-6 w-full text-white" />
      </section>

      {/* ---------------- The wash tubs ---------------- */}
      <section
        id="products"
        className="mx-auto max-w-[1600px] scroll-mt-28 px-4 py-20 lg:px-8 lg:py-28"
      >
        <div className="mb-10">
          <p className="eyebrow text-teal">Standard &amp; Pro Series</p>
          <h2 className="headline mt-3 text-6xl lg:text-8xl">The wash tubs</h2>
        </div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          <Link
            href="/contact-us/"
            className="group flex aspect-square flex-col justify-between bg-deep p-8 text-white"
          >
            <p className="eyebrow text-aqua">Not sure which fits?</p>
            <div>
              <h3 className="headline text-5xl">We&apos;ll help you choose</h3>
              <p className="mt-4 text-white/75">
                Tell us about your grooming space and we&apos;ll recommend the right tub.
              </p>
              <span className="btn btn-light mt-6 group-hover:bg-aqua-light">Build a Quote</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ---------------- 50 / 50: quality ---------------- */}
      <section className="grid bg-foam lg:grid-cols-2">
        <div className="relative aspect-square lg:aspect-auto lg:min-h-[640px]">
          <Image
            src={media("dog-wash-tubs-header2.jpg")}
            alt="A dog enjoying a bath"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center px-6 py-16 sm:px-12 lg:px-20">
          <div className="max-w-xl">
            <p className="eyebrow text-teal">Groomers · Kennels · Vet Clinics · Apartments</p>
            <h2 className="headline mt-4 text-6xl text-deep lg:text-7xl">
              Upgrade bath time
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">
              Cool Dog Wash Tubs crafts durable, premium dog wash tubs and dog bath tubs, made in the
              U.S.A. Intelligently designed and handcrafted for daily use.
            </p>
            <p className="mt-4 leading-relaxed text-ink/70">
              Choose a Standard Series tub in 48″ or 60″, or a stainless steel Pro Series tub with
              parallel or perpendicular access — each with left or right side plumbing.
            </p>
            <Link href="/shop/" className="btn btn-primary mt-8">
              Shop Wash Tubs
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Feature band ---------------- */}
      <section className="border-b border-line bg-white" aria-labelledby="why-heading">
        <h2 id="why-heading" className="sr-only">
          Why Cool Dog wash tubs
        </h2>
        <div className="mx-auto grid max-w-[1600px] gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="bg-white px-6 py-12 lg:px-8">
              <div className="flex items-center justify-between text-teal">
                <Icon width={28} height={28} />
                <span className="eyebrow text-muted">0{i + 1}</span>
              </div>
              <h3 className="headline mt-8 text-3xl">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Story banners ---------------- */}
      <section className="mx-auto grid max-w-[1600px] gap-4 px-4 py-20 md:grid-cols-2 lg:px-8 lg:py-28">
        <StoryBanner
          href="/dog-park/cool-dog-wash-tub-architectural-series-safety-steps/"
          image={media("ArchTubStairs-CloseUp.jpg")}
          alt="Safety steps leading up to a Cool Dog wash tub"
          eyebrow="Accessories"
          title="Safety steps"
          cta="Shop Steps"
        />
        <StoryBanner
          href="/dog-park/cool-dog-standard-series-grooming-table/"
          image={media("standard-series-grooming-tables-with-dog.png")}
          alt="A dog on a Standard Series grooming table"
          eyebrow="Grooming"
          title="Grooming tables"
          cta="Shop Tables"
        />
      </section>
    </>
  );
}

function StoryBanner({
  href,
  image,
  alt,
  eyebrow,
  title,
  cta,
}: {
  href: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group relative isolate flex aspect-[4/5] items-end overflow-hidden text-white sm:aspect-[4/3]"
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="-z-10 object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-deep/45 to-transparent" />
      <div className="p-6 lg:p-10">
        <p className="eyebrow text-aqua-light">{eyebrow}</p>
        <h2 className="headline mt-3 text-5xl lg:text-7xl">{title}</h2>
        <span className="btn btn-light mt-6">{cta}</span>
      </div>
    </Link>
  );
}
