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
      if (e.key === 'Escape' && !isLoading) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="surface w-full max-w-md bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-2xl hover:bg-stone-100 transition-colors disabled:opacity-50"
            aria-label="Close"
            title="Close"
          >
            <X className="h-5 w-5 text-stone-500" />
          </button>

          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <p className="mt-2 text-stone-600">{description}</p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-secondary flex-1 disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={clsx('btn flex-1 disabled:opacity-50', {
                'btn-danger': variant === ModalVariant.Danger,
              })}
            >
              {isLoading ? confirmLoadingText : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
