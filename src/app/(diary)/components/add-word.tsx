'use client';

import AddWordDefinition from '@/app/(diary)/components/add-word-definition';
import { WordLookupResponse } from '@/app/lib/definitions';
import { Search } from 'lucide-react';
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
      <div className="max-w-2xl w-full p-4 border border-stone-200 rounded-2xl">
        <div className="flex items-center rounded-full p-2 shadow-md border border-stone-300 transition-shadow focus-within:shadow-lg">
          <input
            type="text"
            id="searchWord"
            value={word}
            onChange={e => setWord(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Enter a word"
            className="flex-grow px-6 py-2 outline-none text-lg font-medium"
          />
          <div className="flex gap-2 pr-1">
            <button
              onClick={searchDefinition}
              className="px-4 py-2 flex items-center text-sm rounded-full border font-medium shadow-sm hover:shadow-md hover:bg-stone-200 transition-all"
            >
              <Search className="mr-2 h-3.5 w-3.5" />
              Search
            </button>
            <button
              onClick={searchDefinitionWithGoogle}
              className="px-4 py-2 rounded-full flex items-center text-sm border border-blue-500 font-medium shadow-sm hover:shadow-md text-blue-500 hover:bg-blue-100 transition-all"
            >
              Google It
            </button>
          </div>
        </div>
        <p className="text-sm mt-3">
          <span className="keycap-style">Enter</span> search ·{' '}
          <span className="keycap-style">Shift</span> +{' '}
          <span className="keycap-style">Enter</span> Google ·{' '}
          <span className="keycap-style">Esc</span> clear
        </p>
        {error && <div className="error-message mt-2 font-medium">{error}</div>}
      </div>
      <div className="mt-10">
        <AddWordDefinition
          wordDefinition={wordDefinition}
          onSave={() => setWordDefinition(null)}
        />
      </div>
    </div>
  );
};

export default AddWord;
