'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

const normalizeQuery = (value?: string | null) => value?.trim() ?? '';

const SavedWordsSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildDiaryUrl = (value: string) => {
    const normalizedQuery = normalizeQuery(value);
    const params = new URLSearchParams(searchParams.toString());
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

  return (
    <div className="w-full max-w-lg rounded-[1.5rem] border border-[var(--brass)] bg-[var(--paper-card)] p-2 sm:p-3">
      <div className="flex items-center rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-soft)] px-3 py-2 transition-all duration-200 focus-within:border-[var(--brass-dark)] sm:px-4">
        <Search className="h-4 w-4 text-[var(--ink-muted)]" />
        <input
          type="search"
          autoComplete="off"
          defaultValue={searchParams.get('q')?.toString()}
          onChange={event => handleSearch(event.target.value)}
          placeholder="Search"
          className="min-w-0 flex-1 pl-2 text-sm font-semibold text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] sm:pl-3 sm:text-base"
        />
      </div>
    </div>
  );
};

export default SavedWordsSearch;
