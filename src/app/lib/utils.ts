import { DictionaryServiceObject, Meaning } from '@/app/lib/definitions';
import createSupabaseServerClient from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';

export const convertDictionaryServiceResponse = (
  dictionaryServiceResponse: DictionaryServiceObject[],
  word: string
) => {
  dictionaryServiceResponse = dictionaryServiceResponse.map(entry => {
    if (entry.hwi && entry.hwi.hw) {
      entry.hwi.hw = entry.hwi.hw.replaceAll('*', '');
    }
    return entry;
  });

  dictionaryServiceResponse = dictionaryServiceResponse.filter(
    (entry: DictionaryServiceObject) => entry.hwi && entry.hwi.hw === word
  );

  if (dictionaryServiceResponse.length === 0) {
    return null;
  }

  dictionaryServiceResponse = dictionaryServiceResponse.slice(0, 6);

  const meanings: Meaning[] = [];
  for (const entry of dictionaryServiceResponse) {
    meanings.push({
      part_of_speech: entry.fl,
      definitions: entry.shortdef,
    });
  }
  const formattedWord = {
    word,
    meanings,
  };
  return formattedWord;
};

export const redirectToSignupIfNotLoggedIn = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log('User is not logged in, redirecting to signup page');
    redirect('/signup');
  }
};

export const redirectToHomeIfLoggedIn = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    console.log('User is logged in, redirecting to home page');
    redirect('/');
  }
};
