'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DeleteWordModalProps {
  word: string;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteWordModal = ({
  word,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteWordModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/60"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] p-6 shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <button
          onClick={handleClose}
          disabled={isDeleting}
          className="absolute right-3 top-3 rounded-full p-2 text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)]"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="display-font mb-2 text-2xl font-semibold text-[var(--ink)]">
          {`Delete "${word}"?`}
        </h3>

        <p className="mb-6 text-[var(--ink-muted)]">
          This will permanently remove this word from your list. This action
          cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 rounded-full border border-[var(--brass)] bg-[var(--paper-card)] px-4 py-2 font-semibold text-[var(--ink-muted)] transition-all hover:bg-[var(--paper)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-full border border-[var(--danger)] bg-[var(--danger)] px-4 py-2 font-semibold text-[var(--paper-card)] transition-all hover:bg-[var(--danger-dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteWordModal;
