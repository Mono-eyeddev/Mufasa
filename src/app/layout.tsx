import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Instrument_Serif, Hanken_Grotesk, DM_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/site/header";
import { siteConfig } from "@/content/site";

const display = Big_Shoulders({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial Narrow", "sans-serif"],
});

const serifAccent = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif-accent",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "MUFASA® — Victor Oginga, Photography · Design · Film",
    template: "%s — MUFASA®",
  },
  description: siteConfig.description,
  keywords: [
    "Victor Oginga",
    "MUFASA",
    "photographer",
    "graphic designer",
    "filmmaker",
    "brand identity",
    "creative direction",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: "MUFASA® — Victor Oginga",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "MUFASA®",
    type: "website",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "MUFASA® — Victor Oginga",
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ECE7DC",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  alternateName: "MUFASA®",
  description: siteConfig.description,
  url: siteConfig.url,
  jobTitle: [
    "Photographer",
    "Graphic Designer",
    "Filmmaker",
    "Brand Identity Designer",
    "Campaign Creative Director",
  ],
  knowsAbout: ["Photography", "Graphic Design", "Film", "Branding", "Creative Direction"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${serifAccent.variable} ${body.variable} ${mono.variable} antialiased bg-paper text-ink`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink focus:text-paper focus:px-4 focus:py-2 mono-label"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
