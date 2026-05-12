import AddWordModal from '@/app/diary/components/add-word-modal';
import Pagination from '@/app/diary/components/pagination';
import SavedWordsSearch from '@/app/diary/components/saved-words-search';
import WordList from '@/app/diary/components/word-list';
import WordListSkeleton from '@/app/diary/components/word-list-skeleton';
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
    <main>
      <div className="relative mx-auto mt-6 w-full max-w-7xl rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] pb-4 pt-7 sm:mt-7 sm:pb-5 sm:pt-8">
        <h2 className="display-font absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] border border-[var(--brass)] bg-[var(--paper-soft)] px-3 py-1 text-center text-[0.62rem] font-bold uppercase whitespace-nowrap text-[var(--ink-muted)] sm:px-5 sm:py-1.5 sm:text-[0.74rem]">
          Your Saved Words
        </h2>
        <div className="flex flex-col items-center px-3.5 sm:px-4">
          <div className="w-full max-w-6xl">
            <div className="relative min-h-11 sm:min-h-12">
              <Suspense>
                <div className="mx-auto w-[min(30rem,calc(100%-6rem))]">
                  <SavedWordsSearch />
                </div>
              </Suspense>
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <AddWordModal />
              </div>
            </div>
          </div>
          <Suspense key={`${q}-${currentPage}`} fallback={<WordListSkeleton />}>
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
