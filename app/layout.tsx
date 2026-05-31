import type { Metadata } from "next";
import { Fraunces, Parisienne, Nunito } from "next/font/google";
import { content } from "@/lib/content";
import "./globals.css";

// Soft, characterful storybook serif — display headings and body.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

// Hand-painted flowing script — the baby's name and tender accents.
const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-parisienne",
  display: "swap",
});

// Rounded, friendly humanist sans — labels and UI.
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

// The live site URL — used so link previews (the share image) resolve to an
// absolute URL. Set to the deployed Vercel domain. If you later move to a custom
// domain, update this (or set NEXT_PUBLIC_SITE_URL in Vercel) and redeploy.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://invitationcard-jade.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: content.site.title,
  description: content.site.description,
  // Rich preview when the link is shared on WhatsApp / Messenger / Facebook.
  openGraph: {
    type: "website",
    // Canonical URL. Every personalized link (?to=…&role=…) shows the SAME
    // generic preview, so we point them all at the bare URL — Facebook then
    // caches ONE preview object and reuses it for all 34 links (scrape once,
    // every link shows the card). The link each guest taps is still their own
    // ?to=… ; og:url only controls Facebook's caching, not the click target.
    url: SITE_URL,
    siteName: content.site.title,
    title: content.site.title,
    description: content.site.description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: content.site.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: content.site.title,
    description: content.site.description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${parisienne.variable} ${nunito.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
