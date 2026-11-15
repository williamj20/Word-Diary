import WordItem from '@/app/diary/components/word-item';
import { getUserWordsByQuery } from '@/app/lib/data';

const WordList = async ({
  ownerId,
  isOwnDiary,
  currentPage,
  query,
}: {
  ownerId: string;
  isOwnDiary: boolean;
  currentPage: number;
  query: string;
}) => {
  const words = await getUserWordsByQuery(ownerId, query, currentPage);

  const isEmpty = words.length === 0;
  let emptyMessage = isOwnDiary
    ? 'Look up your first word and save it to start your diary.'
    : 'This diary has no saved words yet.';
  if (currentPage > 1) {
    emptyMessage = 'No saved words on this page.';
  } else if (query) {
    emptyMessage = 'No saved words match that search.';
  }

  return (
    <div className="word-list-container">
      {isEmpty ? (
        <p className="my-6 text-center text-sm text-[var(--ink-muted)] sm:text-base">
          {emptyMessage}
        </p>
      ) : null}
      {words.map(word => (
        <WordItem key={word.id} word={word} isOwnDiary={isOwnDiary} />
      ))}
    </div>
  );
};

export default WordList;
