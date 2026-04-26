'use client';

import Modal from '@/app/diary/components/modal';
import { ModalVariant } from '@/app/lib/definitions';
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

  const modalTitle = `Delete "${word}"?`;
  const modalDescription = `This will permanently remove this word from your list. This action cannot be undone.`;
  const modalConfirmText = 'Delete';
  const modalConfirmLoadingText = 'Deleting..';
  const modalCancelText = 'Cancel';

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
        aria-label={`Delete ${word}`}
        className="icon-button border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-[var(--paper-card)] enabled:hover:shadow-lg"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title={modalTitle}
        description={modalDescription}
        confirmText={modalConfirmText}
        confirmLoadingText={modalConfirmLoadingText}
        cancelText={modalCancelText}
        variant={ModalVariant.Danger}
        isLoading={isPending}
      />
    </>
  );
};

export default DeleteButton;
