import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import SavedGrid from "@/components/account/SavedGrid";
import { getCustomer, getSaved } from "@/lib/account";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false, follow: false } };

/** The WordPress site's wishlist, backed by the shopper's saved products in the CMS. */
export default function WishlistPage() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-14 lg:px-8 lg:py-20">
      <p className="eyebrow text-teal">Saved for later</p>
      <h1 className="headline mt-3 text-6xl lg:text-7xl">Wishlist</h1>
      <Suspense fallback={<div className="mt-8 h-80 animate-pulse bg-mist" />}>
        <Saved />
      </Suspense>
    </section>
  );
}

async function Saved() {
  const customer = await getCustomer();
  if (!customer) {
    return (
      <div className="mt-8 max-w-xl bg-foam p-6 text-[15px]">
        <p>Sign in to see the products you&apos;ve saved. One account works on every The Dog Park Company store.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/account/login/?next=/wishlist/" className="btn btn-primary">
            Sign In
          </Link>
          <Link href="/account/register/?next=/wishlist/" className="btn btn-outline">
            Create Account
          </Link>
        </div>
      </div>
    );
  }
  return <SavedGrid saved={await getSaved()} columns={4} />;
}
