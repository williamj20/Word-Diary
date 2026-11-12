'use client';

import WordMeaning from '@/app/diary/components/word-meaning';
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
          ? 'border-[var(--sage)] bg-[var(--sage-soft)]'
          : 'border-[var(--brass)] bg-[var(--paper-muted)]'
      )}
    >
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center justify-between gap-4">
          <h3 className="word-card-title whitespace-nowrap">
            {wordDefinition.word.word}
          </h3>
          <SaveButton
            isAbleToSave={isAbleToSave}
            isSaving={isSaving}
            onSave={saveWord}
          />
        </div>
      </div>
      <div className="mt-3">
        {wordDefinition.word.meanings.map((meaning, index) => (
          <WordMeaning key={index} meaning={meaning} />
        ))}
      </div>
      {saveError ? (
        <p className="error-message mt-3 text-center">{saveError}</p>
      ) : null}
    </article>
  );
};

export default AddWordDefinition;
