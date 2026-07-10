import AppHeader from '@/app/components/app-header';

const FlashcardsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader showAuthButtons />
      {children}
    </>
  );
};

export default FlashcardsLayout;
