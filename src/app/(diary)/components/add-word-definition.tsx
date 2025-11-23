'use client';

import { addWordToUserList } from '@/app/lib/actions';
import { WordLookupResponse } from '@/app/lib/definitions';
import clsx from 'clsx';
import { Plus } from 'lucide-react';

const AddWordDefinition = ({
  wordDefinition,
}: {
  wordDefinition: WordLookupResponse | null;
}) => {
  const saveWord = async () => {
    if (!wordDefinition) {
      return;
    }
    try {
      await addWordToUserList(1, wordDefinition.word);
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  if (wordDefinition) {
    const isAbleToSave = !wordDefinition.isInUserList;
    return (
      <div className="w-full max-w-7xl px-4 py-3 mt-6 rounded-lg border border-gray-200 text-lg font-medium">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">{wordDefinition.word.word}</div>
          <div className="flex items-center gap-4">
            {!isAbleToSave && (
              <span className="text-sm text-gray-800">
                Already in your list
              </span>
            )}
            <button
              disabled={!isAbleToSave}
              onClick={saveWord}
              className={clsx('p-2 rounded-lg transition-all shadow-md', {
                'text-gray-800 bg-gray-200 cursor-not-allowed': !isAbleToSave,
                'text-green-800 bg-green-200 hover:bg-green-300 active:bg-green-400 enabled:hover:shadow-lg':
                  isAbleToSave,
              })}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-start gap-4">
          {wordDefinition.word.meanings.map((meaning, index) => (
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
