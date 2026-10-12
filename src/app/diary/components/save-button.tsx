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
        'action-button px-3 py-2 text-xs sm:text-sm',
        isAbleToSave
          ? 'action-button-primary'
          : 'action-button-secondary bg-[var(--paper)]'
      )}
    >
      <span>{isSaving ? 'Saving...' : isAbleToSave ? 'Save' : 'Saved'}</span>
    </button>
  );
};

export default SaveButton;
