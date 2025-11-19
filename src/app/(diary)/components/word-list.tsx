import WordItem from '@/app/(diary)/components/word-item';
import { getUserWords } from '@/app/lib/actions';

export default async function WordList() {
  const words = await getUserWords(1);

  return (
    <div className="mt-12 flex flex-col items-center">
      {words.map(word => (
        <WordItem key={word.id} word={word} />
      ))}
    </div>
  );
}
