import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { TopNav } from "@/components/top-nav";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600", "700", "800"]
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
        className={`${openSans.variable} min-h-screen bg-paper font-sans text-ink antialiased`}
      >
        <div className="mx-auto flex min-h-screen w-full max-w-page flex-col px-4 py-5 sm:px-8 sm:py-8">
          <TopNav />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
