import AppHeader from '@/app/components/app-header';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader showAuthButtons={false} />
      {children}
    </>
  );
};

export default PublicLayout;
