import type { Metadata } from "next";
import {Inter,IBM_Plex_Serif, Geist, Geist_Mono} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets:["latin"],variable: '--font-inter'});
const ibmserifplex = IBM_Plex_Serif({
  subsets: ['latin'],
  weight:['400','700'],
  variable: '--font-ibm-plex-serif'
})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banking App",
  description: "Horizen is a modern banking platform for everyone.",
  icons:{
    icon:'/public/window.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
