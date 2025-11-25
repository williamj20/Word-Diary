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
        className={clsx('p-2 rounded-lg transition-all shadow-md', {
          'text-gray-800 bg-gray-200 cursor-not-allowed': !isAbleToSave,
          'text-green-800 bg-green-200 hover:bg-green-300 active:bg-green-400 enabled:hover:shadow-lg':
            isAbleToSave,
        })}
      >
        <Plus className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SaveButton;
