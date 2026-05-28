import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VibeMarket - Scalable Two-Sided Marketplace',
  description: 'Buy and sell premium tech gadgets, street apparel, and accessories with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full bg-slate-950 text-slate-100 font-sans antialiased flex flex-col`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
