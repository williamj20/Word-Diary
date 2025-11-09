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
      <body className={`${quicksand.variable} antialiased`}>{children}</body>
    </html>
  );
}
