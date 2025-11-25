'use client';

import { Trash2 } from 'lucide-react';

const DeleteButton = ({
  deleteAction,
}: {
  deleteAction: (formData: FormData) => void;
}) => {
  return (
    <form
      action={deleteAction}
      onSubmit={e => {
        if (!confirm(`Delete? This action cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="p-2 rounded-lg text-red-800 bg-red-200 hover:bg-red-300 active:bg-red-400 transition-all shadow-md enabled:hover:shadow-lg"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </form>
  );
};

export default DeleteButton;
