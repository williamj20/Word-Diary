import { BookOpenText } from 'lucide-react';
import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import AuthButtons from '@/app/components/auth-buttons';

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
        <header className="relative mt-5 mb-12">
          <Link href="/" className="flex gap-3 items-center justify-center">
            <BookOpenText className="w-10 h-10" />
            <h1 className="font-semibold text-5xl">Word Diary</h1>
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
