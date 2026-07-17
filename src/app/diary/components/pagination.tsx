'use client';

import clsx from 'clsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

// Shows first page, last page, current page, and current page +/- 1. All other pages are shown as ellipsis
const getPaginationItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items = new Set<number>([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  const pages = Array.from(items)
    .filter(page => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const paginationItems = [];

  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    const previousPage = pages[index - 1];

    if (previousPage && page - previousPage > 1) {
      paginationItems.push('ellipsis');
    }

    paginationItems.push(page);
  }

  return paginationItems;
};

const paginationBaseClassName =
  'inline-flex items-center justify-center rounded-full border border-[var(--brass)] bg-[var(--paper-card)] text-xs font-semibold text-[var(--ink-muted)] transition-all duration-200 hover:bg-[var(--paper)] hover:text-[var(--ink)] sm:text-sm';

const PaginationNumber = ({
  href,
  isActive,
  pageNumber,
}: {
  href: string;
  isActive: boolean;
  pageNumber: number | string;
}) => {
  return (
    <Link
      href={href}
      className={clsx(
        paginationBaseClassName,
        'min-w-8 px-2 py-1 sm:min-w-10 sm:px-3 sm:py-2',
        isActive
          ? 'border-[var(--sage)] bg-[var(--sage-dark)] text-[var(--paper-card)] hover:bg-[var(--sage)] hover:text-[var(--paper-card)]'
          : ''
      )}
    >
      {pageNumber}
    </Link>
  );
};

const PaginationArrow = ({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'previous' | 'next';
  isDisabled?: boolean;
}) => {
  const icon =
    direction === 'previous' ? (
      <ArrowLeft className="h-4 w-4" />
    ) : (
      <ArrowRight className="h-4 w-4" />
    );

  return isDisabled ? (
    <button type="button" disabled className="pagination-nav-button">
      {icon}
    </button>
  ) : (
    <Link href={href} className="pagination-nav-button">
      {icon}
    </Link>
  );
};

const Pagination = ({ totalPages }: { totalPages: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const paginationItems = getPaginationItems(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:mt-5 sm:gap-3">
      <PaginationArrow
        direction="previous"
        isDisabled={currentPage <= 1}
        href={createPageURL(currentPage - 1)}
      />

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {paginationItems.map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-xs font-bold tracking-[0.2em] text-[var(--ink-muted)] sm:text-sm"
            >
              ...
            </span>
          ) : (
            <PaginationNumber
              key={item}
              href={createPageURL(item)}
              isActive={item === currentPage}
              pageNumber={item}
            />
          )
        )}
      </div>

      <PaginationArrow
        direction="next"
        isDisabled={currentPage >= totalPages}
        href={createPageURL(currentPage + 1)}
      />
    </div>
  );
};

export default Pagination;
