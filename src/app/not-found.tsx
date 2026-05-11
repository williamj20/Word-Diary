import AppHeader from '@/app/components/app-header';

const NotFound = () => {
  return (
    <div className="overflow-x-auto">
      <div className="mx-auto min-w-xs px-3">
        <AppHeader showAuthButtons={false} />
        <div className="flex items-center justify-center">
          <h2 className="display-font text-md font-bold uppercase text-[var(--ink)]">
            Page Not Found
          </h2>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
