import type { Metadata } from "next";
import { Inter } from "next/font/google";
import packageJson from '../../package.json';

import "./globals.css";

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
        className={`${interSans.variable} ${interMono.variable} antialiased`}
      >
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4">
          <header className="row-start-1 flex flex-wrap items-center justify-center">
            <h1 className="text-center text-2xl/6 w-full">
              React next components
            </h1>
          </header>
          <main className="flex flex-col h-full w-full items-center justify-center sm:items-start p-6">
            {children}
          </main>
          <footer className="row-start-3 flex flex-wrap items-center justify-center">
            <p className="text-center text-xs sm:text-sm/6 text-black dark:text-white">
              Copyright © {new Date().getFullYear()}. Todos os direitos reservados. v{packageJson.version}
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
