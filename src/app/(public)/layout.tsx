import AppHeader from '@/app/components/app-header';
import { getCurrentUser } from '@/app/lib/utils';

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  return (
    <>
      <AppHeader showAuthenticatedControls={Boolean(user)} />
      {children}
    </>
  );
};

export default PublicLayout;
