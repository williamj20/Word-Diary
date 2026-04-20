'use client';

import { ModalVariant } from '@/app/lib/definitions';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  confirmLoadingText: string;
  cancelText: string;
  variant: ModalVariant;
  isLoading: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  confirmLoadingText,
  cancelText,
  variant,
  isLoading,
}: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/60"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-[2rem] border border-[var(--brass)] bg-[var(--paper-card)] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-3 top-3 rounded-full p-2 text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)] disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="display-font mb-2 text-2xl font-semibold text-[var(--ink)]">
          {title}
        </h3>

        <p className="mb-6 leading-7 text-[var(--ink-muted)]">{description}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-full border border-[var(--brass)] bg-[var(--paper-card)] px-4 py-2 font-semibold text-[var(--ink-muted)] transition-all hover:bg-[var(--paper)] disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={clsx(
              'flex-1 rounded-full border px-4 py-2 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50',
              {
                'border-[var(--danger)] bg-[var(--danger)] text-[var(--paper-card)] hover:bg-[var(--danger-dark)]':
                  variant === ModalVariant.Danger,
              }
            )}
          >
            {isLoading ? confirmLoadingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
