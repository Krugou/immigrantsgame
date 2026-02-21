import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'md' }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  const maxWidthClass = maxWidthClasses[maxWidth] || maxWidthClasses.md;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && onClose) {
          onClose();
        }
      }}
    >
      <div className={`cinematic-card relative w-full ${maxWidthClass}`}>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}

        {title && (
          <h2 id="modal-title" className="text-2xl font-bold text-center text-white mb-6">
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
