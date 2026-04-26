'use client';

import SaveButton from '@/app/diary/components/create-button';
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
    const saveWordAction = addWordToUserList.bind(null, wordDefinition.word);
    const isAbleToSave = !wordDefinition.isInUserList;

    const saveWord = async () => {
      const res = await saveWordAction();
      if (res.success) {
        onSave();
      }
    };

    return (
      <article
        className={clsx(
          'word-card',
          isAbleToSave
            ? 'border-2 border-[var(--sage-dark)] bg-[var(--sage-soft)] shadow-2xl'
            : 'border border-[var(--brass)] bg-[var(--paper-muted)] saturate-50 shadow-md'
        )}
      >
        <div className="word-card-content-container">
          <h3 className="word-card-title">{wordDefinition.word.word}</h3>
          <div className="word-card-button-container">
            {!isAbleToSave && (
              <span className="word-card-span bg-[var(--paper)] text-[var(--brass-dark)]">
                Already in your list
              </span>
            )}
            <SaveButton isAbleToSave={isAbleToSave} saveAction={saveWord} />
          </div>
        </div>
        <div className="word-card-meanings-container">
          {wordDefinition.word.meanings.map((meaning, index) => (
            <div key={index} className="word-card-meanings">
              <div className="word-card-meanings-part-of-speech">
                {meaning.part_of_speech}
              </div>
              <ul className="word-card-meanings-definitions">
                {meaning.definitions.map((definition, defIndex) => (
                  <li key={defIndex}>{definition}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>
    );
  }
  return null;
};

export default AddWordDefinition;
