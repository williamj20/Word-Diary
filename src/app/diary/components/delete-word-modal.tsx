'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DeleteWordModalProps {
  word: string;
  isOpen: boolean;
  isDeleting: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteWordModal = ({
  word,
  isOpen,
  isDeleting,
  error,
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
    <div className="word-modal-backdrop" onClick={handleClose}>
      <div
        className="word-modal-panel block max-w-md overflow-y-auto overscroll-contain"
        onClick={event => event.stopPropagation()}
      >
        <button
          onClick={handleClose}
          disabled={isDeleting}
          className="word-modal-close"
        >
          <X />
        </button>

        <h3 className="mb-2 pr-9 break-words text-xl font-semibold text-[var(--ink)] sm:pr-10 sm:text-2xl">
          {`Delete "${word}"?`}
        </h3>

        <p className="text-sm text-[var(--ink-muted)] sm:text-base">
          This will permanently remove this word from your list. This action
          cannot be undone.
        </p>

        {error ? <p className="error-message mt-4">{error}</p> : null}

        <div className="mt-4 flex shrink-0 flex-wrap gap-3 sm:mt-6">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="action-button action-button-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="action-button border-[var(--danger)] bg-[var(--danger)] text-[var(--paper-card)] enabled:hover:bg-[var(--danger-dark)]"
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
