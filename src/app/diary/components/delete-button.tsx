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
        setDeleteError('Unable to delete this word. Please try again.');
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
        className="icon-button border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-[var(--paper-card)]"
      >
        <Trash2 className="h-4 w-4" />
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
