'use client';

import SaveButton from '@/app/diary/components/save-button';
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
  if (!wordDefinition) {
    return null;
  }
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
        'rounded-[1.75rem] border p-5',
        isAbleToSave
          ? 'border border-[var(--sage-dark)] bg-[var(--sage-soft)] shadow-2xl'
          : 'border border-[var(--brass)] bg-[var(--paper-muted)] saturate-50 shadow-md'
      )}
    >
      <div className="word-card-content-container">
        <h3 className="word-card-title">{wordDefinition.word.word}</h3>
        <div>
          <SaveButton isAbleToSave={isAbleToSave} onSave={saveWord} />
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
    </article>
  );
};

export default AddWordDefinition;
