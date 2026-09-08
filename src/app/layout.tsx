export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import "./globals.css";

// src/lib/fonts.ts
import {
  Inter,
  Playfair_Display,
  Roboto_Slab,
  JetBrains_Mono,
  Syne,
  Pacifico,
  Press_Start_2P,
  Cinzel_Decorative,
  Comfortaa,
  Bebas_Neue,
  Permanent_Marker,
  Orbitron,
  Space_Grotesk,
  Bangers,
  Alex_Brush,
  Black_Ops_One,
  Caveat,
  Abril_Fatface,
  EB_Garamond,
  Pirata_One,
} from "next/font/google";

// 1. Clean UI Sans
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
  display: "swap",
});

// 2. Editorial Serif
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
  display: "swap",
});

// 3. Slab Serif
export const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--font-roboto-slab",
  display: "swap",
});

// 4. Developer Monospace
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// 5. Brutalist / Display
export const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

// 6. Casual Script
export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
  display: "swap",
});

// 7. 8-Bit Pixel Retro
export const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
  display: "swap",
});

// 8. Art Deco
export const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cinzel-decorative",
  display: "swap",
});

// 9. Rounded Sans
export const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-comfortaa",
  display: "swap",
});

// 10. Condensed Headline
export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
  display: "swap",
});

// 11. Street Marker
export const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-permanent-marker",
  display: "swap",
});

// 12. Futuristic / Sci-Fi
export const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

// 13. Tech Grotesk
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// 14. Comic / Pop-Art
export const bangers = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bangers",
  display: "swap",
});

// 15. Formal Calligraphy
export const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-alex-brush",
  display: "swap",
});

// 16. Industrial Stencil
export const blackOpsOne = Black_Ops_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-black-ops-one",
  display: "swap",
});

// 17. Handwritten Brush
export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caveat",
  display: "swap",
});

// 18. Vintage Poster Fatface
export const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-abril-fatface",
  display: "swap",
});

// 19. Old-Style Book Serif
export const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-eb-garamond",
  display: "swap",
});

// 20. Gothic Blackletter
export const pirataOne = Pirata_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pirata-one",
  display: "swap",
});


export const metadata: Metadata = {
  title: "DhanLaxmi",
  description: "DhanLaxmi is a modern banking platform for everyone.",
  icons: {
    icon: '/icons/download_bankbit.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="">{children}</body>
    </html>
  );
}