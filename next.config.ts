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
  },
};

export default nextConfig;
