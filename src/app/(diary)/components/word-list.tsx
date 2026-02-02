import WordItem from '@/app/(diary)/components/word-item';
import { getUserWords } from '@/app/lib/data';
import createSupabaseServerClient from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';

const WordList = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signup');
  }
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
