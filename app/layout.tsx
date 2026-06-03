import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { TopNav } from "@/components/top-nav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: "400"
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
        className={`${inter.variable} ${instrumentSerif.variable} min-h-screen bg-paper font-sans text-ink antialiased`}
      >
        <div className="mx-auto flex min-h-screen w-full max-w-page flex-col px-5 py-7 sm:px-8 sm:py-10">
          <TopNav />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
