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
        if (response.status === 404)
          setError(DEFINITION_NOT_FOUND_ERROR_MESSAGE);
        else setError(SOMETHING_WENT_WRONG);
        return;
      }

      setWordDefinition(data);
    } catch (error) {
      console.error('Error fetching definition:', error);
      setError(SOMETHING_WENT_WRONG);
    }
  };

  return (
    <div className="w-full">
      <div className="surface p-4 ring-1 ring-stone-200/70 focus-within:ring-2 focus-within:ring-emerald-400/60">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            id="searchWord"
            value={word}
            onChange={e => setWord(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a word…"
            className="input"
          />

          <div className="flex gap-2 sm:flex-none">
            <button onClick={searchDefinition} className="btn btn-secondary">
              <Search className="h-4 w-4" />
              Search
            </button>
            <button
              onClick={searchDefinitionWithGoogle}
              className="btn btn-outline"
            >
              Google it
            </button>
          </div>
        </div>

        <p className="helper-text mt-3">
          Tip: <span className="kbd">Enter</span> search ·{' '}
          <span className="kbd">Shift</span>+<span className="kbd">Enter</span>{' '}
          Google · <span className="kbd">Esc</span> clear
        </p>

        {error && <div className="error-message mt-2 font-medium">{error}</div>}
      </div>

      <div className="mt-6">
        <AddWordDefinition
          wordDefinition={wordDefinition}
          onSave={() => setWordDefinition(null)}
        />
      </div>
    </div>
  );
};

export default AddWord;
