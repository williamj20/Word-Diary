'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AddWord() {
  const [word, setWord] = useState('');
  const [error, setError] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [definition, setDefinition] = useState('Test');

  useEffect(() => {
    setError('');
  }, [word]);

  const EMPTY_WORD_ERROR_MESSAGE = 'Please enter a word before searching.';

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

  function searchDefinition() {
    const trimmedWord = word.trim();
    if (!trimmedWord) {
      setError(EMPTY_WORD_ERROR_MESSAGE);
      return;
    }
    console.log(trimmedWord);
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
      {definition.trim() && (
        <div className="w-full max-w-3xl px-4 py-3 mt-6 flex items-center justify-between rounded-lg border border-gray-200 text-lg font-medium">
          {definition}
          <button className="p-2 rounded-lg text-green-800 bg-green-200 hover:bg-green-300 active:bg-green-400 transition-all shadow-md enabled:hover:shadow-lg">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
