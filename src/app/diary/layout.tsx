import AppHeader from '@/components/app-header';

const DiaryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader showAuthenticatedControls />
      {children}
    </>
  );
};

export default DiaryLayout;
