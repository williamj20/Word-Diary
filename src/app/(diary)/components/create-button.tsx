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
        title={isAbleToSave ? 'Save word' : 'Already saved'}
        className={clsx('icon-btn', {
          'bg-stone-100 text-stone-400 cursor-not-allowed': !isAbleToSave,
          'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:shadow-md':
            isAbleToSave,
        })}
      >
        <Plus className="h-5 w-5" />
      </button>
    </form>
  );
};

export default SaveButton;
