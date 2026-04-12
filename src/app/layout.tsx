import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "./providers";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = "https://perfumare-jade.vercel.app";

export const metadata: Metadata = {
  title: {
    template: "%s | Perfumare",
    default: "Perfumare — The Art of Arabian Perfumery",
  },
  description:
    "Discover, compare, and review thousands of perfumes. Where ancient traditions meet modern luxury. The ultimate fragrance encyclopedia.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "Perfumare",
    title: "Perfumare — The Art of Arabian Perfumery",
    description: "Discover, compare, and review thousands of perfumes. Where ancient traditions meet modern luxury.",
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfumare — The Art of Arabian Perfumery",
    description: "Discover, compare, and review thousands of perfumes. Where ancient traditions meet modern luxury.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`h-full antialiased ${playfair.variable} ${cormorant.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <AnimatedBackground />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="relative z-10 flex flex-col min-h-full">
              {children}
            </div>
          </Providers>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
