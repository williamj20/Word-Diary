import AppHeader from '@/app/components/app-header';

const DiaryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader showAuthButtons />
      {children}
    </>
  );
};

export default DiaryLayout;
