'use client';

import DeleteWordModal from '@/app/diary/components/delete-word-modal';
import { Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';

const DeleteButton = ({
  word,
  deleteAction,
}: {
  word: string;
  deleteAction: () => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteAction();
      setShowModal(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
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
      />
    </>
  );
};

export default DeleteButton;
