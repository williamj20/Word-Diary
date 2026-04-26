'use client';

import clsx from 'clsx';
import { Plus } from 'lucide-react';

const SaveButton = ({
  saveAction,
  isAbleToSave,
}: {
  saveAction: () => void;
  isAbleToSave: boolean;
}) => {
  return (
    <form action={saveAction}>
      <button
        disabled={!isAbleToSave}
        type="submit"
        aria-label="Save word"
        className={clsx(
          'icon-button',
          isAbleToSave
            ? 'border-[var(--sage)] bg-[var(--sage-soft)] text-[var(--sage-dark)] hover:bg-[var(--sage)] hover:text-[var(--paper-card)] enabled:hover:shadow-lg'
            : 'cursor-not-allowed border-[var(--brass)] bg-[var(--paper)] text-[var(--ink-muted)] opacity-60'
        )}
      >
        <Plus className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SaveButton;
