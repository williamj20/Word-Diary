import AuthButtons from '@/app/components/auth-buttons';
import { BookOpenText } from 'lucide-react';
import Link from 'next/link';

const AppHeader = ({ showAuthButtons }: { showAuthButtons: boolean }) => {
  return (
    <header className="relative mx-auto mb-12 mt-5 max-w-7xl">
      <Link
        href="/"
        className="flex items-center justify-center gap-3"
        aria-label="Word Diary home"
      >
        <BookOpenText className="h-6 w-6 sm:h-10 lg:w-10" />
        <h1 className="display-font text-4xl font-semibold text-[var(--ink)] lg:text-6xl">
          Word Diary
        </h1>
      </Link>

      {showAuthButtons && (
        <div className="mt-4 flex justify-center sm:absolute sm:right-6 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2">
          <AuthButtons />
        </div>
      )}
    </header>
  );
};

export default AppHeader;
