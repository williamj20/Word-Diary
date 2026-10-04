'use client';

import { logout } from '@/app/lib/actions/auth';
import { LogOut, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const accountMenuItemClass =
  'flex w-full items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-left text-xs font-bold text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)] lg:gap-2 lg:px-3 lg:py-2 lg:text-sm';

const AccountMenu = () => {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const details = detailsRef.current;
      if (
        details?.open &&
        event.target instanceof Node &&
        !details.contains(event.target)
      ) {
        details.open = false;
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, []);

  return (
    <details ref={detailsRef} className="relative">
      <summary
        className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-[var(--brass)] bg-[var(--paper-card)] text-[var(--ink-muted)] shadow-sm transition-all duration-200 hover:bg-[var(--paper)] hover:text-[var(--ink)] [&::-webkit-details-marker]:hidden"
        title="Account menu"
      >
        <UserRound className="h-5 w-5" />
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-36 rounded-2xl border border-[var(--brass)] bg-[var(--paper-card)] p-1 shadow-xl lg:w-44 lg:p-1.5">
        <Link
          href="/profile"
          onClick={closeMenu}
          className={accountMenuItemClass}
        >
          <UserRound className="h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4" />
          Profile
        </Link>
        <form action={logout} onSubmit={closeMenu}>
          <button type="submit" className={accountMenuItemClass}>
            <LogOut className="h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </details>
  );
};

export default AccountMenu;
