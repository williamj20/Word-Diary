'use client';

import DeleteWordModal from '@/app/diary/components/delete-word-modal';
import { MutationResult } from '@/app/lib/definitions';
import { Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';

const DeleteButton = ({
  word,
  deleteAction,
}: {
  word: string;
  deleteAction: () => Promise<MutationResult>;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      setDeleteError('');
      const result = await deleteAction();
      if (result.success) {
        setShowModal(false);
      } else {
        setDeleteError('Unable to remove this word. Please try again.');
      }
    });
  };

  return (
    <>
      <button
        onClick={() => {
          setDeleteError('');
          setShowModal(true);
        }}
        title="Remove word"
        className="icon-button h-8 w-8 border-[var(--danger)]/40 bg-[var(--danger-soft)]/50 text-[var(--danger)] hover:border-[var(--danger)] hover:bg-[var(--danger-soft)] active:border-[var(--danger)] active:bg-[var(--danger-soft)] sm:h-10 sm:w-10"
      >
        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>

      <DeleteWordModal
        word={word}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        isDeleting={isPending}
        error={deleteError}
      />
    </>
  );
};

export default DeleteButton;
