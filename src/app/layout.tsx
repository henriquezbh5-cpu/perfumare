import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | 1000PerfumesNight",
    default: "1000PerfumesNight — The Fragrance Encyclopedia",
  },
  description:
    "Discover, compare, and review thousands of perfumes. The ultimate fragrance encyclopedia for scent lovers worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
