import type { Metadata } from 'next';
import { Literata } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'Word Diary',
  description: 'A place to keep track of new words.',
};

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
      <body className={`${literata.variable} antialiased`}>
        <div className="scrollbar-none overflow-x-auto">
          <div className="mx-auto w-fit min-w-[max(100%,var(--app-min-width))] px-3">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
