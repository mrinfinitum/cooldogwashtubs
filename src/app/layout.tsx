import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, DM_Mono, Hanken_Grotesk } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

const label = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dog Wash Tubs | Cool Dog Wash Tubs",
    template: "%s | Cool Dog Wash Tubs",
  },
  description:
    "Durable, premium dog wash tubs and dog bath tubs made in the USA. Standard and Pro Series tubs, grooming tables, safety steps and dryers.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: [
      { url: "/media/favicon-32.png", sizes: "32x32" },
      { url: "/media/favicon-192.png", sizes: "192x192" },
    ],
    apple: "/media/favicon-180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#003078",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${label.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">{children}</body>
      {/* Google Analytics 4, production only (loads after the page is interactive). */}
      {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
    </html>
  );
}
