import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NarratorStudio — Audiobook Narrator Workflow",
  description: "One workspace for ACX pronunciations, pickups, auditions, invoices, and rights dates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
