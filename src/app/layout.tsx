import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";

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
  metadataBase: new URL(site.url),
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
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
