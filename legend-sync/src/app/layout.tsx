import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: "Legend Sync", template: "%s | Legend Sync" },
  description:
    "Legend League history, ranked season insights, meta armies, clan summaries and war analysis for Clash of Clans players.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark scheme-dark ${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-ink-950 font-sans text-ink-100 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
