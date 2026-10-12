import AppHeader from '@/app/components/app-header';

const NotFound = () => {
  return (
    <>
      <AppHeader showAuthenticatedControls={false} />
      <div className="mx-auto w-full max-w-3xl rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] px-5 py-8 text-center sm:px-8 sm:py-10">
        <h2 className="text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
          Page Not Found
        </h2>
      </div>
    </>
  );
};

export default NotFound;
