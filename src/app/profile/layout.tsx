import AppHeader from '@/app/components/app-header';

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader showAuthenticatedControls />
      {children}
    </>
  );
};

export default ProfileLayout;
