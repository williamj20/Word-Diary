import WordItem from '@/app/diary/components/word-item';
import { getUserWordsByQuery } from '@/app/lib/data';

const WordList = async ({
  currentPage,
  query,
}: {
  currentPage: number;
  query: string;
}) => {
  const words = await getUserWordsByQuery(query, currentPage);

  const isEmpty = words.length === 0;

  return (
    <div className="word-list-container">
      {isEmpty && query ? (
        <p className="mt-4 text-center text-sm font-semibold text-[var(--ink-muted)]">
          No saved words match that search.
        </p>
      ) : null}
      {isEmpty && !query ? (
        <p className="mt-4 text-center text-sm font-semibold text-[var(--ink-muted)]">
          Your saved words will appear here.
        </p>
      ) : null}
      {!isEmpty
        ? words.map(word => <WordItem key={word.id} word={word} />)
        : null}
    </div>
  );
};

export default WordList;
