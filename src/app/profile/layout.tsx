import AppHeader from '@/components/app-header';

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader showAuthenticatedControls />
      {children}
    </>
  );
};

export default ProfileLayout;
