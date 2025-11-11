'use client';

import AddWordDefinition from '@/app/(search)/components/add-word-definition';
import { DictionaryServiceObject } from '@/app/lib/definitions';
import { useEffect, useState } from 'react';

const EMPTY_WORD_ERROR_MESSAGE = 'Please enter a word before searching.';

const DEFINITION_NOT_FOUND_ERROR_MESSAGE =
  'Definition not found. Please try another word.';
const SOMETHING_WENT_WRONG = 'Something went wrong. Please try again.';

export default function AddWord() {
  const [word, setWord] = useState('');
  const [error, setError] = useState('');

  const [definition, setDefinition] = useState<
    DictionaryServiceObject[] | null
  >(null);

  useEffect(() => {
    setError('');
  }, [word]);

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && event.shiftKey) {
      searchDefinitionWithGoogle();
    } else if (event.key === 'Enter') {
      searchDefinition();
    } else if (event.key === 'Escape') {
      setWord('');
    }
  }

  function searchDefinitionWithGoogle() {
    const trimmedWord = word.trim();
    if (!trimmedWord) {
      setError(EMPTY_WORD_ERROR_MESSAGE);
      return;
    }
    const searchUrl = `https://www.google.com/search?q=define+${encodeURIComponent(trimmedWord)}`;
    window.open(searchUrl, '_blank');
  }

  async function searchDefinition() {
    const trimmedWord = word.trim();
    if (!trimmedWord) {
      setError(EMPTY_WORD_ERROR_MESSAGE);
      return;
    }
    try {
      const response = await fetch(
        `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(trimmedWord)}?key=${process.env.NEXT_PUBLIC_DICTIONARY_KEY}`
      );
      if (!response.ok) {
        console.log('Error fetching definition:', error);
        setError(SOMETHING_WENT_WRONG);
        return;
      }
      let data: DictionaryServiceObject[] = await response.json();
      data = data.filter(
        (entry: DictionaryServiceObject) =>
          entry.hwi && entry.hwi.hw === trimmedWord
      );
      if (data.length === 0) {
        setError(DEFINITION_NOT_FOUND_ERROR_MESSAGE);
        return;
      }
      setDefinition(data);
      // setDefinition(mockDefinition2);
    } catch (error) {
      console.log('Error fetching definition:', error);
      setError(SOMETHING_WENT_WRONG);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            id="searchWord"
            value={word}
            onChange={e => setWord(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Enter a word"
            className="px-4 py-3 border text-lg font-medium"
          />
          <button
            onClick={searchDefinition}
            className="px-4 py-5 h-4 flex items-center text-sm rounded-lg border font-medium shadow-md enabled:hover:shadow-lg hover:bg-gray-200 active:bg-gray-300 transition-all disabled:opacity-50"
          >
            Search
          </button>
          <button
            onClick={searchDefinitionWithGoogle}
            className="px-4 py-5 h-4 rounded-lg flex items-center text-sm border border-blue-500 font-medium shadow-md hover:shadow-lg text-blue-500 hover:bg-blue-200 active:bg-blue-300 transition-all"
          >
            Google It
          </button>
        </div>
        {error && (
          <div className="text-sm font-medium text-red-600 mt-1">{error}</div>
        )}
      </div>
      <AddWordDefinition wordsResponse={definition} />
    </div>
  );
}
