'use client';

import clsx from 'clsx';

const SaveButton = ({
  onSave,
  isAbleToSave,
  isSaving = false,
}: {
  onSave: () => void;
  isAbleToSave: boolean;
  isSaving?: boolean;
}) => {
  const isDisabled = !isAbleToSave || isSaving;

  return (
    <button
      disabled={isDisabled}
      type="button"
      onClick={onSave}
      className={clsx(
        'rounded-full border px-3 py-2 text-sm font-bold transition-all duration-200',
        isAbleToSave
          ? 'border-[var(--sage)] bg-[var(--sage-dark)] text-[var(--paper-card)] hover:bg-[var(--sage)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[var(--sage-dark)]'
          : 'cursor-not-allowed border-[var(--brass)] bg-[var(--paper)] text-[var(--ink-muted)] opacity-60'
      )}
    >
      <span>{isSaving ? 'Saving...' : isAbleToSave ? 'Save' : 'Saved'}</span>
    </button>
  );
};

export default SaveButton;
