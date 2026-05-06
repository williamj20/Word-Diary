import AddWord from '@/app/diary/components/add-word';
import Pagination from '@/app/diary/components/pagination';
import SavedWordsSearch from '@/app/diary/components/saved-words-search';
import WordList from '@/app/diary/components/word-list';
import { getUserWordsPages } from '@/app/lib/data';
import { getCurrentUser, redirectToSignupIfNotLoggedIn } from '@/app/lib/utils';
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
    page?: string | string[];
  }>;
}) => {
  await redirectToSignupIfNotLoggedIn();
  const user = await getCurrentUser();

  const searchParams = await props.searchParams;
  const q = normalizeSearchParam(searchParams?.q);
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = Math.max(1, await getUserWordsPages(user!.id, q));

  return (
    <main className="px-4">
      <div className="mt-7 relative mx-auto w-full max-w-7xl rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] pb-4 pt-8">
        <h2 className="display-font absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] border border-[var(--brass)] bg-[var(--paper-soft)] px-4 py-1 text-center text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--ink-muted)] sm:px-5 sm:py-1.5 sm:text-[0.74rem]">
          Your Saved Words
        </h2>
        <div className="flex flex-col items-center px-4">
          <div className="w-full max-w-6xl">
            <div className="flex flex-col gap-2.5 md:relative md:min-h-10 md:items-center">
              <Suspense>
                <div className="w-full md:mx-auto md:max-w-[30rem]">
                  <SavedWordsSearch />
                </div>
              </Suspense>
              <div className="flex justify-end md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
                <AddWord />
              </div>
            </div>
          </div>
          <Suspense>
            <WordList currentPage={currentPage} query={q} userId={user!.id} />
          </Suspense>
          <div>
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DiaryPage;
