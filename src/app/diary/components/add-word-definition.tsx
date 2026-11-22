'use client';

import SaveButton from '@/app/diary/components/save-button';
import WordMeaning from '@/components/word-meaning';
import { saveWordToDiary } from '@/lib/actions/diary';
import type { WordLookupResponse } from '@/types/word';
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
    <article className="min-w-min rounded-[1.75rem] border border-[var(--paper-muted)] bg-[var(--paper-card)] p-3 [background-image:linear-gradient(135deg,var(--paper-card),var(--paper))] sm:p-5">
      <div className="flex min-w-max items-center justify-between gap-4">
        <h3 className="word-card-title">{wordDefinition.word.word}</h3>
        <SaveButton
          isAbleToSave={isAbleToSave}
          isSaving={isSaving}
          onSave={saveWord}
        />
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
