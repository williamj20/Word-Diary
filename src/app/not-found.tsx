import AppHeader from '@/app/components/app-header';

const NotFound = () => {
  return (
    <>
      <AppHeader showAuthenticatedControls={false} />
      <div className="flex items-center justify-center">
        <h2 className="text-md font-bold uppercase text-[var(--ink)]">
          Page Not Found
        </h2>
      </div>
    </>
  );
};

export default NotFound;
