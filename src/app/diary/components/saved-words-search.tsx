'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

const normalizeQuery = (value?: string | null) => value?.trim() ?? '';

const SavedWordsSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((value: string) => {
    const normalizedQuery = normalizeQuery(value);
    const params = new URLSearchParams();
    if (normalizedQuery) {
      params.set('q', normalizedQuery);
    } else {
      params.delete('q');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="mt-6 w-full max-w-lg rounded-[2rem] border p-4 shadow-lg bg-[var(--paper-card)] border-[var(--brass)]">
      <div className="flex items-center rounded-[1.5rem] border border-[var(--brass)] bg-[var(--paper-soft)] px-5 py-3 transition-all duration-200 focus-within:border-[var(--brass-dark)]">
        <Search className="h-4 w-4 text-[var(--ink-muted)]" />
        <input
          type="search"
          autoComplete="off"
          defaultValue={searchParams.get('q')?.toString()}
          onChange={event => handleSearch(event.target.value)}
          placeholder="Search your saved words"
          className="min-w-0 flex-1 pl-3 text-base font-semibold text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]"
        />
      </div>
    </div>
  );
};

export default SavedWordsSearch;
