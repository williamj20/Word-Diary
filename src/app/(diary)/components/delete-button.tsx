'use client';

import Modal from '@/app/(diary)/components/modal';
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
  const modalDescription =
    'This will permanently remove this word from your list. This action cannot be undone.';

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
        className="icon-btn bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-md"
        aria-label={`Delete ${word}`}
        title="Delete"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title={modalTitle}
        description={modalDescription}
        confirmText="Delete"
        confirmLoadingText="Deleting…"
        cancelText="Cancel"
        variant={ModalVariant.Danger}
        isLoading={isPending}
      />
    </>
  );
};

export default DeleteButton;
