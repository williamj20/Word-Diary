import AuthButtons from '@/app/components/auth-buttons';
import MobileHeaderMenu from '@/app/components/mobile-header-menu';
import { BookMarked, BookOpenText, Sparkles } from 'lucide-react';
import Link from 'next/link';

const AppHeader = ({ showAuthButtons }: { showAuthButtons: boolean }) => {
  return (
    <header className="mx-auto mb-8 mt-1 max-w-7xl sm:mb-10">
      <div
        className={
          showAuthButtons
            ? 'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4'
            : 'flex justify-center'
        }
      >
        <Link
          href="/"
          className="flex min-w-0 items-center justify-start gap-2 md:justify-self-start md:gap-3.5"
        >
          <BookOpenText className="h-5 w-5 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
          <h1
            className={
              showAuthButtons
                ? 'display-font text-[clamp(1.75rem,9vw,3.65rem)] font-semibold whitespace-nowrap text-[var(--ink)] md:text-[clamp(1.95rem,4vw,3.65rem)]'
                : 'display-font text-[clamp(1.95rem,8vw,3.65rem)] font-semibold text-[var(--ink)]'
            }
          >
            Word Diary
          </h1>
        </Link>

        {showAuthButtons && <MobileHeaderMenu />}

        {showAuthButtons && (
          <nav className="hidden justify-center gap-2 text-xs font-bold text-[var(--ink-muted)] md:flex md:justify-self-center md:text-sm">
            <Link
              href="/diary"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brass)] bg-[var(--paper-card)] px-3 py-1.5 shadow-sm transition-all duration-200 hover:bg-[var(--paper)] hover:text-[var(--ink)]"
            >
              <BookMarked className="h-3.5 w-3.5" />
              Diary
            </Link>
            <Link
              href="/flashcards"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brass)] bg-[var(--paper-card)] px-3 py-1.5 shadow-sm transition-all duration-200 hover:bg-[var(--paper)] hover:text-[var(--ink)]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Flashcards
            </Link>
          </nav>
        )}

        {showAuthButtons && (
          <div className="hidden justify-center md:flex md:justify-self-end">
            <AuthButtons />
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
