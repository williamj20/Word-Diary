import AppHeader from '@/app/components/app-header';
import { requireProfileIsCreatedIfLoggedIn } from '@/app/lib/auth';

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
