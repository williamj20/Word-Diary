import { logout } from '@/app/lib/actions/auth';
import { BookMarked, LogOut, Menu, Sparkles } from 'lucide-react';
import Link from 'next/link';

const menuItemClass =
  'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)]';

const MobileHeaderMenu = () => {
  return (
    <details className="relative md:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-[var(--brass)] bg-[var(--paper-card)] px-3 py-1.5 text-xs font-bold text-[var(--ink-muted)] shadow-sm transition-all duration-200 hover:bg-[var(--paper)] hover:text-[var(--ink)] [&::-webkit-details-marker]:hidden">
        <Menu className="h-3.5 w-3.5" />
        Menu
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-44 rounded-2xl border border-[var(--brass)] bg-[var(--paper-card)] p-1.5 shadow-xl">
        <Link href="/diary" className={menuItemClass}>
          <BookMarked className="h-4 w-4" />
          Diary
        </Link>
        <Link href="/flashcards" className={menuItemClass}>
          <Sparkles className="h-4 w-4" />
          Flashcards
        </Link>
        <form action={logout}>
          <button type="submit" className={menuItemClass}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </details>
  );
};

export default MobileHeaderMenu;
