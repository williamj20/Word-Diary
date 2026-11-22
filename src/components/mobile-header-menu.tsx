'use client';

import { logout } from '@/lib/actions/auth';
import { BookMarked, LogOut, Menu, Sparkles, UserRound } from 'lucide-react';
import HeaderNavLink from '@/components/header-nav-link';
import { useHeaderMenu } from '@/hooks/use-header-menu';

const MobileHeaderMenu = ({
  profileHref,
  diaryHref,
}: {
  profileHref: string;
  diaryHref: string;
}) => {
  const { detailsRef, closeMenu } = useHeaderMenu();

  return (
    <details ref={detailsRef} className="relative md:hidden">
      <summary className="action-button action-button-secondary cursor-pointer list-none gap-1.5 px-3 py-1.5 text-xs md:text-sm [&::-webkit-details-marker]:hidden">
        <Menu className="h-3.5 w-3.5" />
        Menu
      </summary>
      <div className="header-menu-panel">
        <HeaderNavLink
          href={profileHref}
          section="/profile"
          inMenu
          onClick={closeMenu}
        >
          <UserRound />
          Profile
        </HeaderNavLink>
        <HeaderNavLink
          href="/diary"
          section={diaryHref}
          inMenu
          onClick={closeMenu}
        >
          <BookMarked />
          Diary
        </HeaderNavLink>
        <HeaderNavLink
          href="/flashcards"
          section="/flashcards"
          inMenu
          onClick={closeMenu}
        >
          <Sparkles />
          Flashcards
        </HeaderNavLink>
        <form action={logout} onSubmit={closeMenu}>
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
