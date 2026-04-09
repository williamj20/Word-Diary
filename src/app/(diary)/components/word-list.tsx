import WordItem from '@/app/(diary)/components/word-item';
import { getUserWords } from '@/app/lib/data';
import { getCurrentUser } from '@/app/lib/utils';

const WordList = async () => {
  const user = await getCurrentUser();
  const words = await getUserWords(user!.id);
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
