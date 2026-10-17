'use client';

import { logout } from '@/app/lib/actions/auth';
import { LogOut, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const AccountMenu = ({ profileHref }: { profileHref: string }) => {
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
        className="action-button action-button-secondary h-10 w-10 p-0 cursor-pointer list-none [&::-webkit-details-marker]:hidden"
        title="Account menu"
      >
        <UserRound className="h-5 w-5" />
      </summary>
      <div className="header-menu-panel">
        <Link
          href={profileHref}
          onClick={closeMenu}
          className="header-menu-item"
        >
          <UserRound />
          Profile
        </Link>
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
