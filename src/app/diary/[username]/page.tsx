import AddWordModal from '@/app/diary/components/add-word-modal';
import Pagination from '@/app/diary/components/pagination';
import SavedWordsSearch from '@/app/diary/components/saved-words-search';
import WordList from '@/app/diary/components/word-list';
import WordListSkeleton from '@/app/diary/components/word-list-skeleton';
import {
  ENTRIES_PER_PAGE,
  getProfileByUsername,
  getUserWordsPages,
} from '@/app/lib/data';
import {
  DiarySearchParams,
  getDiarySearchParams,
  getDiaryUrl,
} from '@/app/lib/diary-search-params';
import { getCurrentUser } from '@/app/lib/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

const DiaryPagination = async ({
  ownerId,
  query,
  currentPage,
}: {
  ownerId: string;
  query: string;
  currentPage: number;
}) => {
  const totalPages = Math.max(1, await getUserWordsPages(ownerId, query));

  return <Pagination totalPages={totalPages} currentPage={currentPage} />;
};

const DiaryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams?: Promise<DiarySearchParams>;
}) => {
  const { username } = await params;
  const [profile, viewer, search] = await Promise.all([
    getProfileByUsername(username),
    getCurrentUser(),
    searchParams,
  ]);

  if (!profile) {
    notFound();
  }

  if (username !== profile.username) {
    redirect(getDiaryUrl(profile.username, search));
  }

  const { query, currentPage } = getDiarySearchParams(search);
  const isOwnDiary = viewer?.id === profile.id;

  return (
    <main className="min-w-min">
      <div className="mx-auto mb-9 w-full max-w-7xl px-1 sm:mb-10">
        <h2 className="text-2xl font-semibold break-words text-[var(--ink)] sm:text-3xl">
          {profile.displayName}’s diary
        </h2>
        <Link
          href={`/profile/${profile.username}`}
          className="mt-2 inline-block max-w-full text-sm font-semibold break-all text-[var(--sage-dark)] underline decoration-[var(--brass)] underline-offset-4 transition-colors duration-100 hover:text-[var(--brass-dark)] active:text-[var(--brass-dark)] active:duration-0 sm:text-base"
        >
          @{profile.username}
        </Link>
      </div>
      <div className="relative mx-auto mt-6 w-full min-w-min max-w-7xl rounded-[2rem] border border-[var(--paper-muted)] bg-[var(--paper-card)] pb-4 pt-7 sm:mt-7 sm:pb-5 sm:pt-8">
        <h3 className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] border border-[var(--paper-muted)] bg-[var(--paper-soft)] px-3 py-1 text-center text-[0.625rem] font-bold uppercase whitespace-nowrap text-[var(--ink-muted)] sm:px-5 sm:py-1.5 sm:text-xs">
          {isOwnDiary ? 'Your Saved Words' : 'Saved Words'}
        </h3>
        <div className="flex min-w-min flex-col items-center px-3 sm:px-4">
          <div className="w-full max-w-6xl">
            <div
              className={clsx(
                'grid min-h-11 items-center gap-2 sm:min-h-12 sm:gap-4',
                isOwnDiary && 'grid-cols-[2.75rem_minmax(0,1fr)_2.75rem]'
              )}
            >
              <Suspense>
                <div
                  className={clsx(
                    'min-w-0 w-full max-w-lg justify-self-center',
                    isOwnDiary && 'col-start-2'
                  )}
                >
                  <SavedWordsSearch key={profile.id} />
                </div>
              </Suspense>
              {isOwnDiary ? (
                <div className="justify-self-end">
                  <AddWordModal />
                </div>
              ) : null}
            </div>
          </div>
          <Suspense
            key={`${profile.id}-${query}-${currentPage}`}
            fallback={<WordListSkeleton rows={ENTRIES_PER_PAGE} />}
          >
            <WordList
              ownerId={profile.id}
              isOwnDiary={isOwnDiary}
              currentPage={currentPage}
              query={query}
            />
          </Suspense>
          <div className="w-full max-w-6xl">
            <Suspense
              key={`pagination-${profile.id}-${query}-${currentPage}`}
              fallback={<div className="mt-4 h-9 sm:mt-5 sm:h-11" />}
            >
              <DiaryPagination
                ownerId={profile.id}
                query={query}
                currentPage={currentPage}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DiaryPage;
