import { DictionaryServiceObject, Meaning } from '@/app/lib/definitions';

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
