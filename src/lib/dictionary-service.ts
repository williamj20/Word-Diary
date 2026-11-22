import 'server-only';

const DICTIONARY_CACHE_SECONDS = 60 * 60 * 24 * 30;

export const fetchDictionary = async (word: string): Promise<unknown> => {
  const apiKey = process.env.DICTIONARY_API_KEY;
  if (!apiKey) {
    throw new Error('DICTIONARY_API_KEY is not configured');
  }
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(word)}?key=${apiKey}`,
    {
      next: { revalidate: DICTIONARY_CACHE_SECONDS },
      signal: AbortSignal.timeout(5000),
    }
  );
  if (!response.ok) {
    throw new Error(`Dictionary request failed: ${response.status}`);
  }
  return response.json();
};
