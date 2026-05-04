'use client';

import clsx from 'clsx';

const SaveButton = ({
  onSave,
  isAbleToSave,
}: {
  onSave: () => void;
  isAbleToSave: boolean;
}) => {
  return (
    <button
      disabled={!isAbleToSave}
      type="button"
      onClick={onSave}
      className={clsx(
        'rounded-full border px-3 py-2 text-sm font-bold transition-all duration-200',
        isAbleToSave
          ? 'border-[var(--sage)] bg-[var(--sage-dark)] text-[var(--paper-card)] hover:bg-[var(--sage)]'
          : 'cursor-not-allowed border-[var(--brass)] bg-[var(--paper)] text-[var(--ink-muted)] opacity-60'
      )}
    >
      <span>{isAbleToSave ? 'Save' : 'Saved'}</span>
    </button>
  );
};

export default SaveButton;
