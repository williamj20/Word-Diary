import { BookOpenText } from 'lucide-react';
import type { Metadata } from 'next';
import './globals.css';
import { quicksand } from './ui/fonts';

export const metadata: Metadata = {
  title: 'Word Diary',
  description: 'A place to keep track of new words.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} antialiased`}>
        <div className="flex gap-3 items-center mt-3 justify-center mb-12">
          <BookOpenText className="w-10 h-10" />
          <h1 className="font-semibold text-5xl">Word Diary</h1>
        </div>
        {children}
      </body>
    </html>
  );
}
