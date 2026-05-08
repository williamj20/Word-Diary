import AppHeader from '@/app/components/app-header';

const NotFound = () => {
  return (
    <>
      <AppHeader showAuthButtons={false} />
      <div className="flex items-center justify-center">
        <h2 className="display-font text-md font-bold uppercase text-[var(--ink)]">
          Page Not Found
        </h2>
      </div>
    </>
  );
};

export default NotFound;
