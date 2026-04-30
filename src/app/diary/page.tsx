import AddWord from '@/app/diary/components/add-word';
import SavedWordsSearch from '@/app/diary/components/saved-words-search';
import WordList from '@/app/diary/components/word-list';
import { redirectToSignupIfNotLoggedIn } from '@/app/lib/utils';
import { Suspense } from 'react';

const normalizeSearchParam = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? '';
  }

  return value?.trim() ?? '';
};

const DiaryPage = async (props: {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
}) => {
  await redirectToSignupIfNotLoggedIn();
  const searchParams = await props.searchParams;
  const q = normalizeSearchParam(searchParams?.q);

  return (
    <main>
      <AddWord />
      <div className="mt-24 relative mx-auto w-full max-w-7xl rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] pb-6 pt-12">
        <h2 className="display-font absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] border border-[var(--brass)] bg-[var(--paper-soft)] px-6 py-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-muted)] sm:text-sm">
          Your Saved Words
        </h2>
        <div className="flex flex-col items-center">
          <Suspense>
            <SavedWordsSearch />
          </Suspense>
          <Suspense key={q}>
            <WordList query={q} />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default DiaryPage;
