import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Racine explicite : evite que Turbopack remonte vers le dossier utilisateur
  // lorsqu'un lockfile parasite existe plus haut dans l'arborescence.
  turbopack: {
    root: projectRoot,
  },
  images: {
    // Photographies reelles uniquement : formats modernes + tailles calees
    // sur le breakpoint mobile de reference (~390 px) et ses multiples.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 780, 1024, 1280, 1560, 1920],
    imageSizes: [64, 96, 128, 192, 256, 384],
    // Next 16 n'honore QUE les qualites listees ici ; toute autre valeur passee
    // a `<Image quality>` est ignoree en silence et retombe sur 75.
    //
    // Releve en phase 15B.3 : le hero demandait 78 depuis la phase 5B et les
    // cartes services 68 — les deux etaient servis a 75 sans le moindre
    // avertissement. Mesure : 173 URLs d'images generees, toutes en `q=75`.
    //
    //   68  cartes services — recouvertes d'un degrade de 0,93 a 0,04
    //   70  photographie de la section « Pourquoi »
    //   75  defaut du projet, et hero — voir le commentaire dans `hero.tsx`
    qualities: [68, 70, 75],
  },
};

export default nextConfig;
