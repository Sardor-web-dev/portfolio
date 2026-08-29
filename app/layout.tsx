import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/lib/data/site";

/**
 * The real document shell lives in app/[locale]/layout.tsx, because <html lang>
 * depends on the locale. This root layout exists so that route-level assets
 * outside the locale segment — the share card, robots, the sitemap — still
 * resolve their URLs against the production origin.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
