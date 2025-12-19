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
  if (!wordDefinition) return null;

  const saveWordAction = addWordToUserList.bind(null, 1, wordDefinition.word);
  const isAbleToSave = !wordDefinition.isInUserList;

  const saveWord = async () => {
    await saveWordAction();
    onSave();
  };

  return (
    <div
      className={clsx('word-card', {
        'from-stone-50 to-stone-100 border-l-stone-300': !isAbleToSave,
        'from-emerald-50 to-teal-50 border-l-emerald-400': isAbleToSave,
      })}
    >
      <div className="word-card-content-container">
        <div className="word-card-title">{wordDefinition.word.word}</div>

        <div className="word-card-button-container">
          {!isAbleToSave && (
            <span className="badge badge-muted">Already saved</span>
          )}
          <SaveButton isAbleToSave={isAbleToSave} saveAction={saveWord} />
        </div>
      </div>

      <div className="word-card-meanings-container">
        {wordDefinition.word.meanings.map((meaning, index) => (
          <div key={index} className="word-card-meanings">
            <h3 className="word-card-meanings-part-of-speech">
              {meaning.part_of_speech}
            </h3>
            <ul className="word-card-meanings-definitions">
              {meaning.definitions.map((definition, defIndex) => (
                <li key={defIndex}>{definition}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddWordDefinition;
