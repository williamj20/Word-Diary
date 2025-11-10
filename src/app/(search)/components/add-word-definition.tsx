'use client';

import { WordToSearch } from '@/app/lib/definitions';
import { Plus } from 'lucide-react';

export default function AddWordDefinition({
  wordsResponse,
}: {
  wordsResponse: WordToSearch | null;
}) {
  if (wordsResponse) {
    console.log('wordsResponse:', wordsResponse);
    const slicedResponses = wordsResponse?.dictionaryEntries.slice(0, 3);
    return (
      <div className="w-full max-w-6xl px-4 py-3 mt-6 rounded-lg border border-gray-200 text-lg font-medium">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{wordsResponse?.word}</div>
            <div className="flex">
              {slicedResponses.map((entry, index) => (
                <div key={index} className="w-full max-w-2xl p-2">
                  <h3 className="text-xl font-semibold">{entry.fl}</h3>
                  <ul className="list-disc list-inside">
                    {entry.shortdef.map((definition, defIndex) => (
                      <li key={defIndex}>{definition}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <button className="p-2 rounded-lg text-green-800 bg-green-200 hover:bg-green-300 active:bg-green-400 transition-all shadow-md enabled:hover:shadow-lg">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
  return null;
}
