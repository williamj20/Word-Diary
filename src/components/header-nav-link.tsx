'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const HeaderNavLink = ({
  href,
  section,
  children,
  inMenu = false,
  onClick,
}: {
  href: string;
  section: string;
  children: ReactNode;
  inMenu?: boolean;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === section || pathname.startsWith(`${section}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        inMenu
          ? 'header-menu-item'
          : 'action-button gap-1.5 px-3 py-1.5 text-xs md:text-sm',
        inMenu
          ? isActive && 'bg-[var(--sage-soft)] text-[var(--sage-dark)]'
          : isActive
            ? 'action-button-primary'
            : 'action-button-secondary'
      )}
    >
      {children}
    </Link>
  );
};

export default HeaderNavLink;
