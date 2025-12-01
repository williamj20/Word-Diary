'use client';

import AddWordDefinition from '@/app/(diary)/components/add-word-definition';
import { WordLookupResponse } from '@/app/lib/definitions';
import { useEffect, useState } from 'react';

const EMPTY_WORD_ERROR_MESSAGE = 'Please enter a word before searching.';
const DEFINITION_NOT_FOUND_ERROR_MESSAGE =
  'Definition not found. Please try another word.';
const SOMETHING_WENT_WRONG = 'Something went wrong. Please try again.';

const AddWord = () => {
  const [word, setWord] = useState('');
  const [error, setError] = useState('');

  const [wordDefinition, setWordDefinition] =
    useState<WordLookupResponse | null>(null);

  useEffect(() => {
    setError('');
  }, [word]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
      searchDefinitionWithGoogle();
    } else if (event.key === 'Enter') {
      searchDefinition();
    } else if (event.key === 'Escape') {
      setWord('');
    }
  };

  const searchDefinitionWithGoogle = () => {
    const trimmedWord = word.trim();
    if (!trimmedWord) {
      setError(EMPTY_WORD_ERROR_MESSAGE);
      return;
    }
    const searchUrl = `https://www.google.com/search?q=define+${encodeURIComponent(trimmedWord)}`;
    window.open(searchUrl, '_blank');
  };

  const searchDefinition = async () => {
    const trimmedWord = word.trim().toLowerCase();
    if (!trimmedWord) {
      setError(EMPTY_WORD_ERROR_MESSAGE);
      return;
    }
    try {
      const response = await fetch(`/api/${encodeURIComponent(trimmedWord)}`);
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 404) {
          setError(DEFINITION_NOT_FOUND_ERROR_MESSAGE);
        } else {
          setError(SOMETHING_WENT_WRONG);
        }
        return;
      }
      setWordDefinition(data);
    } catch (error) {
      console.error('Error fetching definition:', error);
      setError(SOMETHING_WENT_WRONG);
    }
  };

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
            className="px-4 py-5 h-4 flex items-center text-sm rounded-lg border font-medium shadow-md enabled:hover:shadow-lg hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            Search
          </button>
          <button
            onClick={searchDefinitionWithGoogle}
            className="px-4 py-5 h-4 rounded-lg flex items-center text-sm border border-blue-500 font-medium shadow-md hover:shadow-lg text-blue-500 hover:bg-blue-100 transition-all"
          >
            Google It
          </button>
        </div>
        {error && (
          <div className="text-sm font-medium text-red-600 mt-1">{error}</div>
        )}
      </div>
      <AddWordDefinition
        wordDefinition={wordDefinition}
        onSave={() => setWordDefinition(null)}
      />
    </div>
  );
};

export default AddWord;
