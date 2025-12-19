import { BookOpenText } from 'lucide-react';
import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Word Diary',
  description: 'A place to keep track of new words.',
};

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} antialiased`}>
        <header className="pt-10 pb-8">
          <div className="page flex items-center justify-center">
            <Link href="/" className="group flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-3xl bg-white/70 ring-1 ring-stone-200/70 shadow-sm backdrop-blur transition group-hover:shadow-md">
                <BookOpenText className="h-8 w-8 text-emerald-700" />
              </span>

              <div className="leading-tight">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Word Diary
                </h1>
                <p className="mt-1 text-sm font-medium text-stone-600 sm:text-base">
                  Save new words. Learn them later.
                </p>
              </div>
            </Link>
          </div>
        </header>

        <main className="page pb-16">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
