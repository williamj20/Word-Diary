import WordItem from '@/app/(diary)/components/word-item';
import { getUserWords } from '@/app/lib/data';

const WordList = async () => {
  const words = await getUserWords(1);

  if (words.length === 0) {
    return (
      <div className="surface p-10 text-center">
        <p className="text-lg font-semibold text-stone-800">No words yet</p>
        <p className="helper-text mt-1">
          Search a word above and hit the plus button to save it.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {words.map(word => (
        <WordItem key={word.id} word={word} />
      ))}
    </div>
  );
};

export default WordList;
