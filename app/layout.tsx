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
// absolute URL. Single source of truth is content.site.url; an env var can
// override it on Vercel (e.g. for a custom domain) without a code change.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? content.site.url;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: content.site.title,
  description: content.site.description,
  // Rich preview when the link is shared on WhatsApp / Messenger / Facebook.
  openGraph: {
    type: "website",
    // ⚠️ Deliberately NO `url` (og:url). Facebook uses og:url as the preview
    // CARD's tap destination — setting it to the bare canonical made tapping the
    // image open the bare/guest page, so godparents who tapped the card (not the
    // text link) lost their ?to= personalization and saw "You're Invited" instead
    // of "Dear Ninong …". This is a static export (one index.html for every
    // ?to=), so og:url can't vary per link. Omitting it makes the card open the
    // actual shared URL (?to=…&role=…), preserving personalization. Tradeoff:
    // each personalized link is its own FB preview object (FB scrapes each on
    // first share) rather than all sharing one — fine now that og.jpg loads fast.
    siteName: content.site.title,
    title: content.site.title,
    description: content.site.description,
    // JPEG (not PNG): Facebook/Messenger/Instagram reliably process JPEG for the
    // big preview card; with the PNG, FB fell back to the app icon. WhatsApp is
    // fine either way. Using a fresh URL (/og.jpg) also bypasses FB's stale cache.
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: content.site.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: content.site.title,
    description: content.site.description,
    images: ["/og.jpg"],
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
