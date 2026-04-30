import WordItem from '@/app/diary/components/word-item';
import { getUserWordsByQuery } from '@/app/lib/data';
import { getCurrentUser } from '@/app/lib/utils';

const WordList = async ({ query }: { query: string }) => {
  const user = await getCurrentUser();
  const words = await getUserWordsByQuery(user!.id, query);

  return (
    <>
      {words.length === 0 && query ? (
        <p className="mt-4 text-sm font-semibold text-[var(--ink-muted)]">
          No saved words match that search.
        </p>
      ) : null}
      {words.map(word => (
        <WordItem key={word.id} word={word} />
      ))}
    </>
  );
};

export default WordList;
