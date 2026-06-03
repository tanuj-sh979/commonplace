import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import type { ReactNode } from "react";
import { TopNav } from "@/components/top-nav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  adjustFontFallback: false
});

export const metadata: Metadata = {
  title: {
    default: "Commonplace",
    template: "%s · Commonplace"
  },
  description:
    "A quiet, curated reading library for essays and newsletters worth returning to."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${newsreader.variable} min-h-screen bg-paper font-sans text-ink antialiased`}
      >
        <div className="mx-auto flex min-h-screen w-full max-w-measure flex-col px-5 py-8 sm:px-8 sm:py-10">
          <TopNav />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
