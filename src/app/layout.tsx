import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./Header";

import "./globals.css";
import { Footer } from "./Footer";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const interMono = Inter({
  variable: "--font-inter-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "React next components",
  description: "React next components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} ${interMono.variable} overflow-hidden h-screen antialiased `}
      >
        <div className="grid grid-rows-[auto_1fr_auto] h-screen">
          <Header />
          <main className="overflow-auto">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
