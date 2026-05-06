import AuthButtons from '@/app/components/auth-buttons';
import { BookOpenText } from 'lucide-react';
import Link from 'next/link';

const AppHeader = ({ showAuthButtons }: { showAuthButtons: boolean }) => {
  return (
    <header className="relative mx-auto mb-12 mt-3 max-w-7xl">
      <Link href="/" className="flex items-center justify-center gap-3">
        <BookOpenText className="h-6 w-6 sm:h-10 lg:w-10" />
        <h1 className="display-font text-[2.2rem] font-semibold leading-none text-[var(--ink)] sm:text-[3.15rem] lg:text-[3.65rem]">
          Word Diary
        </h1>
      </Link>

      {showAuthButtons && (
        <div className="mt-3 flex justify-center sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2">
          <AuthButtons />
        </div>
      )}
    </header>
  );
};

export default AppHeader;
