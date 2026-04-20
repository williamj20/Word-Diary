import { BookOpenText } from 'lucide-react';
import type { Metadata } from 'next';
import { Fraunces, Literata } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import AuthButtons from '@/app/components/auth-buttons';

export const metadata: Metadata = {
  title: 'Word Diary',
  description: 'A place to keep track of new words.',
};

const fraunces = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
});

const literata = Literata({
  variable: '--font-body',
  subsets: ['latin'],
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${literata.variable} antialiased`}>
        <header className="relative mx-auto mb-12 mt-5 max-w-7xl">
          <Link
            href="/"
            className="flex items-center justify-center gap-3"
            aria-label="Word Diary home"
          >
            <BookOpenText className="h-10 w-10" />
            <h1 className="display-font text-6xl font-semibold text-[var(--ink)]">
              Word Diary
            </h1>
          </Link>

          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <AuthButtons />
          </div>
        </header>

        {children}
      </body>
    </html>
  );
};

export default RootLayout;
