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
      <div className="mt-8 flex flex-col items-center">
        <h2 className="display-font text-sm font-bold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          YOUR SAVED WORDS
        </h2>
        <div className="mt-3 h-px w-36 bg-gradient-to-r from-transparent via-[var(--brass)] to-transparent" />
        <Suspense>
          <SavedWordsSearch />
        </Suspense>
        <Suspense key={q}>
          <WordList query={q} />
        </Suspense>
      </div>
    </main>
  );
};

export default DiaryPage;
