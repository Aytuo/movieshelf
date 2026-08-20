import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-sans-movieshelf',
  subsets: ['latin'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-mono-movieshelf',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MovieShelf',
    template: '%s | MovieShelf',
  },
  description:
    'Discover movies, build your personal shelf, rate what you watch and develop your own movie taste.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} `}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
