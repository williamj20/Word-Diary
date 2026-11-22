'use client';

import { logout } from '@/lib/actions/auth';
import { LogOut, UserRound } from 'lucide-react';
import HeaderNavLink from '@/components/header-nav-link';
import { useHeaderMenu } from '@/hooks/use-header-menu';

const AccountMenu = ({ profileHref }: { profileHref: string }) => {
  const { detailsRef, closeMenu } = useHeaderMenu();

  return (
    <details ref={detailsRef} className="relative">
      <summary
        className="action-button action-button-secondary h-11 w-11 p-0 cursor-pointer list-none [&::-webkit-details-marker]:hidden"
        title="Account menu"
      >
        <UserRound className="h-5 w-5" />
      </summary>
      <div className="header-menu-panel">
        <HeaderNavLink
          href={profileHref}
          onClick={closeMenu}
          section="/profile"
          inMenu
        >
          <UserRound />
          Profile
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

export default AccountMenu;
