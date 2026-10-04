import AppHeader from '@/app/components/app-header';

const DiaryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader showAuthenticatedControls />
      {children}
    </>
  );
};

export default DiaryLayout;
