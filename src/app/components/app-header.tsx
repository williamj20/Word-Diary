import AuthButtons from '@/app/components/auth-buttons';
import { BookOpenText } from 'lucide-react';
import Link from 'next/link';

const AppHeader = ({ showAuthButtons }: { showAuthButtons: boolean }) => {
  return (
    <header className="relative mx-auto mb-8 mt-1 max-w-7xl sm:mb-10">
      <Link
        href="/"
        className="flex items-center justify-center gap-2.5 sm:gap-3.5"
      >
        <BookOpenText className="h-5 w-5 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
        <h1 className="display-font text-[clamp(1.95rem,8vw,3.65rem)] font-semibold text-[var(--ink)]">
          Word Diary
        </h1>
      </Link>

      {showAuthButtons && (
        <div className="mt-2.5 flex justify-center sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2">
          <AuthButtons />
        </div>
      )}
    </header>
  );
};

export default AppHeader;
