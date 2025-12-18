'use client';

import SaveButton from '@/app/(diary)/components/create-button';
import { addWordToUserList } from '@/app/lib/actions/db';
import { WordLookupResponse } from '@/app/lib/definitions';
import clsx from 'clsx';

const AddWordDefinition = ({
  wordDefinition,
  onSave,
}: {
  wordDefinition: WordLookupResponse | null;
  onSave: () => void;
}) => {
  if (wordDefinition) {
    const saveWordAction = addWordToUserList.bind(null, 1, wordDefinition.word);
    const isAbleToSave = !wordDefinition.isInUserList;

    const saveWord = async () => {
      await saveWordAction();
      onSave();
    };

    return (
      <div
        className={clsx('word-card', {
          'from-stone-50 to-stone-100 border-l-stone-400 shadow-stone-200/50':
            !isAbleToSave,
          'from-green-50 to-emerald-100 border-l-green-400 shadow-green-200/50':
            isAbleToSave,
        })}
      >
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">{wordDefinition.word.word}</div>
          <div className="flex items-center gap-4">
            {!isAbleToSave && (
              <span className="text-sm text-gray-800">
                Already in your list
              </span>
            )}
            <SaveButton isAbleToSave={isAbleToSave} saveAction={saveWord} />
          </div>
        </div>
        <div className="flex gap-4">
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
