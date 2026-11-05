import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/content";
import { shortName } from "@/lib/format";
import CartButton from "./cart/CartButton";
import { CONTACT, COMPANY_LINKS, LOGO } from "@/lib/site";
import { ChevronIcon, PhoneIcon, UserIcon } from "./icons";
import MobileMenu from "./MobileMenu";

export default async function SiteHeader() {
  const products = await getProducts();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 lg:h-20 lg:px-8">
        <div className="flex h-full items-center">
          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden h-full lg:block">
            <ul className="flex h-full items-center gap-7">
              <li className="group flex h-full items-center">
                <Link
                  href="/shop/"
                  className="eyebrow flex items-center gap-1 py-2 hover:text-teal"
                >
                  Shop <ChevronIcon width={14} height={14} />
                </Link>
                {/* display:none (not visibility) until opened, so its lazy thumbnails aren't fetched on every page */}
                <div className="absolute inset-x-0 top-full hidden border-y border-line bg-white shadow-[0_24px_40px_-24px_rgba(7,34,43,0.35)] group-focus-within:block group-hover:block">
                  <div className="mx-auto max-w-[1600px] px-8 py-10">
                    <ul className="grid grid-cols-5 gap-6">
                      {products.map((p) => (
                        <li key={p.slug}>
                          <Link href={`/dog-park/${p.slug}/`} className="group/card block">
                            <span className="relative block aspect-square overflow-hidden bg-mist">
                              {p.images[0] && (
                                <Image
                                  src={p.images[0].src}
                                  alt={p.images[0].alt}
                                  fill
                                  sizes="260px"
                                  className="object-contain transition duration-500 group-hover/card:scale-[1.04]"
                                />
                              )}
                            </span>
                            <span className="mt-3 block text-[15px] leading-snug group-hover/card:text-teal">
                              {shortName(p.name)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link href="/shop/" className="link-underline mt-8 inline-block text-[15px] font-semibold">
                      Shop All Wash Tubs
                    </Link>
                  </div>
                </div>
              </li>

              <li>
                <Link href="/blog/" className="eyebrow py-2 hover:text-teal">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact-us/" className="eyebrow py-2 hover:text-teal">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <MobileMenu
            products={products.map((p) => ({ href: `/dog-park/${p.slug}/`, label: shortName(p.name) }))}
            company={COMPANY_LINKS}
          />
        </div>

        {/* Logo */}
        <Link href="/" className="block" aria-label="Cool Dog Wash Tubs – home">
          <Image
            src={LOGO.src}
            alt="Cool Dog Wash Tubs"
            width={LOGO.width}
            height={LOGO.height}
            loading="eager"
            sizes="(min-width: 1024px) 165px, 118px"
            className="h-10 w-auto lg:h-14"
          />
        </Link>

        {/* Utilities */}
        <div className="flex items-center justify-end gap-4 lg:gap-6">
          <a
            href={CONTACT.phoneHref}
            className="eyebrow hidden items-center gap-2 hover:text-teal xl:flex"
          >
            <PhoneIcon width={16} height={16} /> {CONTACT.phone}
          </a>
          <Link href="/contact-us/" className="btn btn-primary hidden min-h-10 px-5 lg:inline-flex">
            Build a Quote
          </Link>
          <Link href="/wishlist/" aria-label="Wishlist" className="hidden hover:text-teal sm:block">
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path d="M12 20.5s-7.5-4.6-9.3-9.4C1.4 7.6 3.6 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.6 0 5.8 3.6 4.5 7.1-1.8 4.8-9.3 9.4-9.3 9.4Z" />
            </svg>
          </Link>
          <Link href="/account/" aria-label="My account" className="hover:text-teal">
            <UserIcon width={22} height={22} />
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
