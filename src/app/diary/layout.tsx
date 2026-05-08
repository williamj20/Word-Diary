import AppHeader from '@/app/components/app-header';

const DiaryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-x-auto">
      <div className="mx-auto min-w-xs px-3">
        <AppHeader showAuthButtons />
        {children}
      </div>
    </div>
  );
};

export default DiaryLayout;
