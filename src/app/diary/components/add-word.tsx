'use client';

import AddWordDefinition from '@/app/diary/components/add-word-definition';
import { WordLookupResponse } from '@/app/lib/definitions';
import { Search } from 'lucide-react';
import { useState } from 'react';

const EMPTY_WORD_ERROR_MESSAGE = 'Please enter a word before searching.';
const DEFINITION_NOT_FOUND_ERROR_MESSAGE =
  'Definition not found. Please try another word.';
const SOMETHING_WENT_WRONG = 'Something went wrong. Please try again.';

const AddWord = () => {
  const [word, setWord] = useState('');
  const [error, setError] = useState('');

  const [wordDefinition, setWordDefinition] =
    useState<WordLookupResponse | null>(null);

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
      <div className="w-full max-w-3xl rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] p-5 shadow-xl">
        <div className="flex items-center rounded-[1.5rem] border border-[var(--sage)] bg-[var(--paper-soft)] p-2 shadow-inner focus-within:border-[var(--sage-dark)] focus-within:shadow-lg">
          <input
            type="text"
            id="searchWord"
            value={word}
            onChange={e => {
              setWord(e.target.value);
              setError('');
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Enter a word"
            className="min-w-0 flex-1 px-6 py-3 text-lg font-semibold text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]"
          />
          <div className="flex gap-2 pr-1">
            <button
              type="button"
              onClick={searchDefinition}
              className="flex items-center justify-center rounded-full border border-[var(--sage)] bg-[var(--sage-dark)] px-4 py-2 text-sm font-bold tracking-wide text-[var(--paper-card)] shadow-sm transition-all duration-200 hover:bg-[var(--sage)]"
            >
              <Search className="mr-2 h-3.5 w-3.5" />
              Search
            </button>
            <button
              type="button"
              onClick={searchDefinitionWithGoogle}
              className="flex items-center justify-center rounded-full border border-[var(--brass-dark)] bg-[var(--paper-card)] px-4 py-2 text-sm font-bold tracking-wide text-[var(--brass-dark)] shadow-sm transition-all duration-200 hover:bg-[var(--paper)]"
            >
              Google It
            </button>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <p className="mt-4 text-sm text-[var(--ink-muted)]">
          <span className="keycap-style">Enter</span> search ·{' '}
          <span className="keycap-style">Shift</span> +{' '}
          <span className="keycap-style">Enter</span> Google ·{' '}
          <span className="keycap-style">Esc</span> clear
        </p>
      </div>
      <div className="mt-10 w-full max-w-6xl">
        <AddWordDefinition
          wordDefinition={wordDefinition}
          onSave={() => setWordDefinition(null)}
        />
      </div>
    </div>
  );
};

export default AddWord;
