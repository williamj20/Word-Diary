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
      className="fixed inset-0 z-50 flex min-w-xs items-center justify-center bg-[var(--ink)]/60 p-3 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] p-4 shadow-2xl sm:p-6"
        onClick={event => event.stopPropagation()}
      >
        <button
          onClick={handleClose}
          disabled={isDeleting}
          className="absolute right-2.5 top-2.5 rounded-full p-1.5 text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)] sm:right-3 sm:top-3 sm:p-2"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <h3 className="display-font mb-2 text-xl font-semibold text-[var(--ink)] sm:text-2xl">
          {`Delete "${word}"?`}
        </h3>

        <p className="mb-4 text-sm text-[var(--ink-muted)] sm:mb-6 sm:text-base">
          This will permanently remove this word from your list. This action
          cannot be undone.
        </p>

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="rounded-full border border-[var(--brass)] bg-[var(--paper-card)] px-3 py-2 text-sm font-semibold text-[var(--ink-muted)] transition-all hover:bg-[var(--paper)] disabled:opacity-50 sm:px-4 sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-full border border-[var(--danger)] bg-[var(--danger)] px-3 py-2 text-sm font-semibold text-[var(--paper-card)] transition-all hover:bg-[var(--danger-dark)] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-base"
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
