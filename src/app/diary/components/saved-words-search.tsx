'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const SavedWordsSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const buildDiaryUrl = (value: string) => {
    const normalizedQuery = value.trim();
    const params = new URLSearchParams(searchParams);
    if (normalizedQuery) {
      params.set('q', normalizedQuery);
    } else {
      params.delete('q');
    }
    params.delete('page');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    buildDiaryUrl(value);
  }, 300);

  useEffect(() => {
    const handleHistoryNavigation = () => {
      handleSearch.cancel();
      if (inputRef.current) {
        inputRef.current.value =
          new URLSearchParams(window.location.search).get('q') ?? '';
      }
    };

    window.addEventListener('popstate', handleHistoryNavigation);
    return () =>
      window.removeEventListener('popstate', handleHistoryNavigation);
  }, [handleSearch]);

  return (
    <div className="w-full max-w-lg rounded-[1.5rem] border border-[var(--paper-muted)] bg-[var(--paper-card)] p-1.5 sm:p-3">
      <div className="flex items-center rounded-2xl border border-[var(--brass)] bg-[var(--paper-soft)] px-2 py-2 sm:px-4">
        <Search className="h-4 w-4 shrink-0 text-[var(--ink-muted)]" />
        <input
          ref={inputRef}
          type="search"
          autoComplete="off"
          defaultValue={searchParams.get('q') ?? ''}
          onChange={event => handleSearch(event.target.value)}
          placeholder="Search"
          className="min-w-0 flex-1 pl-2 text-base font-normal text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] sm:pl-3"
        />
      </div>
    </div>
  );
};

export default SavedWordsSearch;
