'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DeleteWordModalProps {
  word: string;
  isOpen: boolean;
  isRemoving: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteWordModal = ({
  word,
  isOpen,
  isRemoving,
  error,
  onClose,
  onConfirm,
}: DeleteWordModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isRemoving) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isRemoving, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    if (!isRemoving) {
      onClose();
    }
  };

  return createPortal(
    <div className="word-modal-backdrop" onClick={handleClose}>
      <div
        className="word-modal-panel max-w-md"
        onClick={event => event.stopPropagation()}
      >
        <button
          onClick={handleClose}
          disabled={isRemoving}
          className="word-modal-close"
        >
          <X />
        </button>
        <div className="word-modal-content scrollbar-none">
          <div className="word-modal-inner">
            <h3 className="mb-2 flex min-h-8 items-center whitespace-nowrap text-xl font-semibold text-[var(--ink)] sm:text-2xl">
              {`Remove "${word}"?`}
            </h3>

            <p className="text-sm text-[var(--ink-muted)] sm:text-base">
              This will permanently remove this word from your list. This action
              cannot be undone.
            </p>

            {error ? <p className="error-message mt-4">{error}</p> : null}

            <div className="mt-4 flex min-w-max gap-3 sm:mt-6">
              <button
                onClick={handleClose}
                disabled={isRemoving}
                className="action-button action-button-secondary"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isRemoving}
                className="action-button border-[var(--danger)] bg-[var(--danger)] text-[var(--paper-card)] enabled:hover:bg-[var(--danger-dark)] enabled:active:bg-[var(--danger-dark)]"
              >
                {isRemoving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteWordModal;
