import AppHeader from '@/components/app-header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

const RecoveryLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <AppHeader showAuthenticatedControls={false} />
    <main className="flex items-center justify-center pb-8">{children}</main>
  </>
);

export default RecoveryLayout;
