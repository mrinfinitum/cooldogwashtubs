import Image from "next/image";
import type { SavedProduct } from "@/lib/account";
import { formatPrice, shortName } from "@/lib/format";
import { RemoveSavedButton } from "./AccountActions";

/** A shopper's saved products (shared across every Dog Park Company store). */
export default function SavedGrid({ saved, columns = 3 }: { saved: SavedProduct[]; columns?: 3 | 4 }) {
  if (!saved.length) {
    return (
      <p className="mt-6 text-[15px] text-ink/75">
        Tap the <strong>heart</strong> on any product to keep it here.
      </p>
    );
  }
  return (
    <ul className={`mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 ${columns === 4 ? "lg:grid-cols-4" : ""}`}>
      {saved.map((s) => {
        // Saved on another store: link there.
        const external = !s.availableHere;
        const href = external ? s.url : `/dog-park/${s.slug}/`;
        return (
          <li key={s.productId} className="flex flex-col">
            <a href={href} className="group block">
              <span className="relative block aspect-square overflow-hidden bg-mist">
                {s.image && (
                  <Image
                    src={s.image.src}
                    alt={s.image.alt}
                    fill
                    sizes="280px"
                    className="object-contain transition duration-500 group-hover:scale-[1.03]"
                  />
                )}
              </span>
              <span className="mt-3 block text-[15px] leading-snug group-hover:text-teal">
                {shortName(s.name)}
              </span>
            </a>
            <span className="mt-1 text-sm text-muted">
              {external && s.storefront ? `On ${s.storefront.name}` : formatPrice(s.price)}
            </span>
            <span className="mt-2">
              <RemoveSavedButton slug={s.slug} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
