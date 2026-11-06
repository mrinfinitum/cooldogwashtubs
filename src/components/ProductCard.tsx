import type { Product } from "@/lib/content";
import ProductCardView from "./ProductCardView";

/**
 * Product tile for grids; passes only what the card needs to the browser.
 * `flip` swaps to the product's second photo on hover; off, the card shows one photo.
 */
export default function ProductCard({
  product,
  priority,
  flip = true,
}: {
  product: Product;
  priority?: boolean;
  flip?: boolean;
}) {
  const { slug, sku, name, price, regularPrice, onSale, images, options, optionIsColor } = product;
  return (
    <ProductCardView
      product={{ slug, sku, name, price, regularPrice, onSale, images: images.slice(0, flip ? 2 : 1), options, optionIsColor }}
      priority={priority}
    />
  );
}
