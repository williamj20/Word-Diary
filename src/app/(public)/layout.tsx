import AppHeader from '@/components/app-header';
import { requireProfileIsCreatedIfLoggedIn } from '@/lib/auth';

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const profile = await requireProfileIsCreatedIfLoggedIn();

  return (
    <>
      <AppHeader showAuthenticatedControls={Boolean(profile)} />
      {children}
    </>
  );
};

export default PublicLayout;
