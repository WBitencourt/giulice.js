import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Header } from '../header';
import { Footer } from '../footer';
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const interMono = Inter({
  variable: "--font-inter-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Giulice.js",
  description: "Biblioteca de componentes React para Next.js",
};

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${interSans.variable} ${interMono.variable} overflow-hidden h-screen antialiased `}
      >
        <NextIntlClientProvider>
          <div className="grid grid-rows-[auto_1fr_auto] h-screen">
            <Header />
            <main className="overflow-auto">
              {children}
            </main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
