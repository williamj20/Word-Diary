import AppHeader from '@/components/app-header';

const FlashcardsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader showAuthenticatedControls />
      {children}
    </>
  );
};

export default FlashcardsLayout;
