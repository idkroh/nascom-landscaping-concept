import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nascom-landscaping-concept.vercel.app"),
  title: "Nascom Landscaping — Living Systems",
  description: "Landscape design, construction, rehabilitation and long-term care across Saudi Arabia.",
  openGraph: {
    title: "Make Room for Living — Nascom Landscaping",
    description: "Landscape design, construction, rehabilitation and long-term care across Saudi Arabia.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Make Room for Living — Nascom Landscaping" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Make Room for Living — Nascom Landscaping",
    description: "Landscape design, construction, rehabilitation and long-term care across Saudi Arabia.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/images/nascom-logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
