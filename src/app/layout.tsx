import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";

import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { area, site } from "@/lib/site";

import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  // Omis volontairement lorsque `NEXT_PUBLIC_SITE_URL` est absente ou invalide :
  // mieux vaut aucune metadataBase qu'une base vide ou localhost servant de
  // canonique en production (cf. resolveSiteOrigin dans src/lib/site.ts).
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  title: {
    default: `${site.name} — Élagueur-grimpeur à ${area.city}`,
    template: `%s | ${site.name}`,
  },
  description: `Élagage, abattage, dessouchage et entretien extérieur à ${area.city} et dans la ${area.metro}. Devis gratuit, intervention rapide, travail sécurisé.`,
  applicationName: site.name,
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#14251E",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-dvh antialiased">
        <SkipLink />
        <SiteHeader />
        {children}
        <SiteFooter />
        {/* Dernier element du flux : sa cale se place apres le footer. */}
        <MobileActionBar />
      </body>
    </html>
  );
}
