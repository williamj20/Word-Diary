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
      className="fixed inset-0 bg-black/50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-2 right-2 p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <h3 className="text-xl font-bold mb-2">{title}</h3>

          <p className="mb-6">{description}</p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-500 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={clsx(
                'flex-1 px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                {
                  'text-white bg-red-600 hover:bg-red-700':
                    variant === ModalVariant.Danger,
                }
              )}
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
