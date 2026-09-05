import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${isDestructive ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'} flex-shrink-0`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-3">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={isDestructive ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};
