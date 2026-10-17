'use client';

import { logout } from '@/app/lib/actions/auth';
import { BookMarked, LogOut, Menu, Sparkles, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const MobileHeaderMenu = ({ profileHref }: { profileHref: string }) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);

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
    <details ref={detailsRef} className="relative md:hidden">
      <summary className="action-button action-button-secondary cursor-pointer list-none gap-1.5 px-3 py-1.5 text-xs md:text-sm [&::-webkit-details-marker]:hidden">
        <Menu className="h-3.5 w-3.5" />
        Menu
      </summary>
      <div className="header-menu-panel">
        <Link href={profileHref} className="header-menu-item">
          <UserRound />
          Profile
        </Link>
        <Link href="/diary" className="header-menu-item">
          <BookMarked />
          Diary
        </Link>
        <Link href="/flashcards" className="header-menu-item">
          <Sparkles />
          Flashcards
        </Link>
        <form action={logout}>
          <button type="submit" className="header-menu-item">
            <LogOut />
            Sign Out
          </button>
        </form>
      </div>
    </details>
  );
};

export default MobileHeaderMenu;
