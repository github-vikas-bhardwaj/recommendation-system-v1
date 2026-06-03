import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { FlashFromCookie } from "./_components/flash-from-cookie";
import { Footer } from "./footer";
import { Header } from "./header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recommendation System",
  description: "Personalized TV show recommendations from your watch history",
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
      <body className="relative flex min-h-full flex-col overflow-x-hidden bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.08)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(139,92,246,0.25),transparent)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_80%_60%,rgba(59,130,246,0.12),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_60%,rgba(59,130,246,0.18),transparent_50%)]"
          aria-hidden
        />
        <Header />
        <main className="relative z-10 flex flex-1 flex-col">{children}</main>
        <Footer />
        <FlashFromCookie />
        <Toaster
          richColors
          position="top-right"
          closeButton
          expand
          duration={4000}
          theme="system"
        />
      </body>
    </html>
  );
}
