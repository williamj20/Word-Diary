import type {
  DictionaryServiceObject,
  DictionaryServiceResponse,
  WordDefinition,
} from '@/app/lib/definitions';

const MAX_SUGGESTIONS = 5;
const MAX_MEANINGS = 6;

const normalizeDictionaryHeadword = (headword: string): string =>
  headword.replaceAll('*', '').trim().toLowerCase();

// https://dictionaryapi.com/products/json#sec-2.prs
export const buildPronunciationUrl = (audio: string): string | null => {
  // Only accept a base filename, never a path or URL from optional metadata.
  if (!audio || /[\s/\\?#]|\p{C}/u.test(audio)) {
    return null;
  }

  let directory = audio[0].toLowerCase();
  if (audio.startsWith('bix')) {
    directory = 'bix';
  } else if (audio.startsWith('gg')) {
    directory = 'gg';
  } else if (!/^[a-z]/i.test(audio)) {
    directory = 'number';
  }

  return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${directory}/${encodeURIComponent(audio)}.mp3`;
};

const findPronunciationUrl = (
  entries: DictionaryServiceObject[]
): string | null => {
  for (const entry of entries) {
    for (const pronunciation of entry.hwi.prs ?? []) {
      const audio = pronunciation?.sound?.audio;
      const url = audio ? buildPronunciationUrl(audio) : null;

      if (url) {
        return url;
      }
    }
  }

  return null;
};

export const convertDictionaryServiceResponse = (
  dictionaryServiceResponse: DictionaryServiceResponse,
  word: string
): WordDefinition | string[] | null => {
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

  const displayedEntries = matchingEntries.slice(0, MAX_MEANINGS);
  const pronunciationUrl = findPronunciationUrl(displayedEntries);

  return {
    word: normalizedWord,
    definitionHeadword,
    pronunciationUrl,
    meanings: displayedEntries.map(entry => ({
      part_of_speech: entry.fl ?? 'unknown',
      definitions: entry.shortdef,
    })),
  };
};
