import type { Metadata } from 'next';
import { Literata, Newsreader } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'Word Diary',
  description: 'A place to keep track of new words.',
};

const newsreader = Newsreader({
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
      <body
        className={`${newsreader.variable} ${literata.variable} antialiased`}
      >
        <div className="overflow-x-auto">
          <div className="mx-auto min-w-xs px-3">{children}</div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
