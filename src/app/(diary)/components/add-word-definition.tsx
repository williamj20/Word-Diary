'use client';

import { Word } from '@/app/lib/definitions';
import { Plus } from 'lucide-react';

const AddWordDefinition = ({ word }: { word: Word | null }) => {
  if (word) {
    return (
      <div className="w-full max-w-7xl px-4 py-3 mt-6 rounded-lg border border-gray-200 text-lg font-medium">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">{word.word}</div>
          <button className="p-2 rounded-lg text-green-800 bg-green-200 hover:bg-green-300 active:bg-green-400 transition-all shadow-md enabled:hover:shadow-lg">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-start gap-4">
          {word.meanings.map((meaning, index) => (
            <div key={index} className="flex-1 max-w-fit p-2">
              <h3 className="text-xl font-semibold">
                {meaning.part_of_speech}
              </h3>
              <ul className="list-disc list-inside">
                {meaning.definitions.map((definition, defIndex) => (
                  <li key={defIndex}>{definition}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default AddWordDefinition;
