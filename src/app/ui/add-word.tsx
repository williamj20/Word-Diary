'use client';

import { useState } from 'react';

export default function AddWord() {
  const [word, setWord] = useState('');

  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  const [definition, setDefinition] = useState('Test');

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
      searchDefinitionWithGoogle();
    } else if (event.key === 'Enter') {
      console.log(word);
    } else if (event.key === 'Escape') {
      setWord('');
    }
  };

  const searchDefinitionWithGoogle = () => {
    const trimmedWord = word.trim();
    if (!trimmedWord) {
      return;
    }
    const searchUrl = `https://www.google.com/search?q=define+${encodeURIComponent(trimmedWord)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center gap-6 min-h-dvh mt-12">
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={word}
          onChange={e => setWord(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Enter a word"
          className="px-4 py-3 border text-lg font-medium"
        />
        <button
          disabled={!word.trim()}
          className="px-4 py-5 h-4 flex items-center text-sm rounded-lg border font-medium shadow-md enabled:hover:shadow-lg enabled:hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search
        </button>
        <button
          onClick={searchDefinitionWithGoogle}
          disabled={!word.trim()}
          className="px-4 py-5 h-4 rounded-lg flex items-center text-sm border border-blue-500 font-medium shadow-md hover:shadow-lg text-blue-500 enabled:hover:bg-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Google It
        </button>
      </div>
      {definition.trim() && (
        <div className="w-3xl px-4 py-3 rounded-lg border border-gray-200 text-lg font-medium">
          {/* <input
          value={definition}
          onChange={e => setDefinition(e.target.value)}
          placeholder="Enter definition here"
          id="definition"
          className="w-3xl px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 outline-none text-lg font-medium"
        /> */}
          {definition}
        </div>
      )}
      {word.trim() && definition.trim() && (
        <button
          disabled={!word.trim() || !definition.trim()}
          className="px-4 py-3 rounded-lg border font-bold text-green-800 bg-green-200 enabled:hover:bg-green-300 transition-all shadow-md enabled:hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
      )}
    </div>
  );
}
