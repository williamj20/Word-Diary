import WordItem from '@/app/(diary)/components/word-item';
import { getUserWords } from '@/app/lib/data';

const WordList = async () => {
  const words = await getUserWords('1');
  return (
    <div className="flex flex-col items-center">
      <h2 className="font-bold">YOUR SAVED WORDS</h2>
      {words.map(word => (
        <WordItem key={word.id} word={word} />
      ))}
    </div>
  );
};

export default WordList;
