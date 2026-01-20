import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  themeColor: '#0A0F1E',
};

export const metadata: Metadata = {
  title: 'Olim Together | Your Journey Home Starts Here',
  description: 'Join thousands of families building their tomorrow in Israel. Olim Together is your guided path to making Aliyah with community, support, and purpose.',
  keywords: ['Aliyah', 'Israel', 'Immigration', 'Jewish community', 'Olim', 'Carmiel'],
  authors: [{ name: 'Olim Together' }],
  openGraph: {
    title: 'Olim Together | Your Journey Home Starts Here',
    description: 'Join thousands of families building their tomorrow in Israel.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Olim Together',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Olim Together | Your Journey Home Starts Here',
    description: 'Join thousands of families building their tomorrow in Israel.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
