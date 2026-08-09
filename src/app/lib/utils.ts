import {
  DictionaryServiceObject,
  DictionaryServiceResponse,
  MeaningContent,
  SourcedWordDefinition,
} from '@/app/lib/definitions';
import createSupabaseServerClient from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const MAX_SUGGESTIONS = 5;
const MAX_MEANINGS = 6;

// Prefix PostgreSQL LIKE/ILIKE metacharacters with the default backslash
// escape character so user-entered `\`, `%`, and `_` are matched literally.
export const escapeLikePattern = (value: string): string =>
  value.replace(/[\\%_]/g, character => `\\${character}`);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeDictionaryHeadword = (headword: string): string =>
  headword.replaceAll('*', '').trim().toLowerCase();

// Nice to have because we are saving the result of the dictionary service to our database
// and we want to ensure that the data is in the expected format before saving it.
const isDictionaryServiceObject = (
  value: unknown
): value is DictionaryServiceObject => {
  if (!isRecord(value) || !isRecord(value.hwi)) {
    return false;
  }

  return (
    typeof value.fl === 'string' &&
    Array.isArray(value.shortdef) &&
    value.shortdef.every(definition => typeof definition === 'string') &&
    typeof value.hwi.hw === 'string'
  );
};

export const convertDictionaryServiceResponse = (
  dictionaryServiceResponse: DictionaryServiceResponse,
  word: string
): SourcedWordDefinition | string[] | null => {
  if (dictionaryServiceResponse.length === 0) {
    return null;
  }

  if (
    dictionaryServiceResponse.every(
      (entry): entry is string => typeof entry === 'string'
    )
  ) {
    return dictionaryServiceResponse.slice(0, MAX_SUGGESTIONS);
  }

  if (!dictionaryServiceResponse.every(isDictionaryServiceObject)) {
    throw new Error('Dictionary service returned a malformed array payload');
  }

  const normalizedWord = word.trim().toLowerCase();
  let definitionHeadword = normalizedWord;
  let matchingEntries = dictionaryServiceResponse.filter(
    entry => normalizeDictionaryHeadword(entry.hwi.hw) === normalizedWord
  );

  if (matchingEntries.length === 0) {
    definitionHeadword = normalizeDictionaryHeadword(
      dictionaryServiceResponse[0].hwi.hw
    );
    matchingEntries = dictionaryServiceResponse.filter(
      entry => normalizeDictionaryHeadword(entry.hwi.hw) === definitionHeadword
    );
  }

  const meanings: MeaningContent[] = matchingEntries
    .slice(0, MAX_MEANINGS)
    .map(entry => ({
      part_of_speech: entry.fl,
      definitions: entry.shortdef,
    }));

  return {
    definition: {
      word: normalizedWord,
      meanings,
    },
    definitionHeadword,
  };
};

export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
});

export const redirectToSignupIfNotLoggedIn = async () => {
  const user = await getCurrentUser();
  if (!user) {
    console.log('User is not logged in, redirecting to signup page');
    redirect('/signup');
  }
  return user;
};

export const redirectToDiaryIfLoggedIn = async () => {
  const user = await getCurrentUser();
  if (user) {
    console.log('User is logged in, redirecting to diary page');
    redirect('/diary');
  }
};
