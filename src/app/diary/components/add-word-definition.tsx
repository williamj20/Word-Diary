'use client';

import SaveButton from '@/app/diary/components/save-button';
import { saveWordToDiary } from '@/app/lib/actions/db';
import { WordLookupResponse } from '@/app/lib/definitions';
import clsx from 'clsx';
import { useState, useTransition } from 'react';

const AddWordDefinition = ({
  wordDefinition,
  onSave,
}: {
  wordDefinition: WordLookupResponse | null;
  onSave: () => void;
}) => {
  const [isSaving, startSavingTransition] = useTransition();
  const [saveError, setSaveError] = useState('');

  if (!wordDefinition) {
    return null;
  }
  const saveWordAction = saveWordToDiary.bind(null, wordDefinition.word.word);
  const isAbleToSave = !wordDefinition.isInUserList;

  const saveWord = () => {
    if (!isAbleToSave || isSaving) {
      return;
    }

    startSavingTransition(async () => {
      setSaveError('');
      const res = await saveWordAction();
      if (res.success) {
        onSave();
      } else {
        setSaveError('Unable to save this word. Please try again.');
      }
    });
  };

  return (
    <article
      className={clsx(
        'rounded-[1.75rem] border p-3 sm:p-5',
        isAbleToSave
          ? 'border border-[var(--sage-dark)] bg-[var(--sage-soft)] shadow-2xl'
          : 'border border-[var(--brass)] bg-[var(--paper-muted)] saturate-50 shadow-md'
      )}
    >
      <div className="word-card-preview-container">
        <h3 className="word-card-title">{wordDefinition.word.word}</h3>
        <div>
          <SaveButton
            isAbleToSave={isAbleToSave}
            isSaving={isSaving}
            onSave={saveWord}
          />
        </div>
      </div>

      <div className="word-card-meanings-container">
        {wordDefinition.word.meanings.map((meaning, index) => (
          <section key={index} className="word-card-meanings">
            <div className="word-card-meanings-part-of-speech">
              {meaning.part_of_speech}
            </div>
            <ul className="word-card-meanings-definitions">
              {meaning.definitions.map((definition, defIndex) => (
                <li key={defIndex}>{definition}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {saveError ? (
        <p className="error-message mt-3 text-center">{saveError}</p>
      ) : null}
    </article>
  );
};

export default AddWordDefinition;
