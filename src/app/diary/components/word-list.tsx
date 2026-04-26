import WordItem from '@/app/diary/components/word-item';
import { getUserWords } from '@/app/lib/data';
import { getCurrentUser } from '@/app/lib/utils';

const WordList = async () => {
  const user = await getCurrentUser();
  const words = await getUserWords(user!.id);
  return (
    <div className="flex flex-col items-center">
      <h2 className="display-font text-sm font-bold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
        YOUR SAVED WORDS
      </h2>
      <div className="mt-3 h-px w-36 bg-gradient-to-r from-transparent via-[var(--brass)] to-transparent" />
      {words.map(word => (
        <WordItem key={word.id} word={word} />
      ))}
    </div>
  );
};

export default WordList;
