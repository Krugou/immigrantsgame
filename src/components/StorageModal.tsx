import React from 'react';
import Modal from './common/Modal';
import Button from './common/Button';
import { Cloud, HardDrive, Trash2 } from 'lucide-react';
import Text from './common/Text';

interface StorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocal: () => void;
  onSelectCloud: () => void;
  onReset: () => void;
  canClose: boolean;
}

const StorageModal = ({
  isOpen,
  onClose,
  onSelectLocal,
  onSelectCloud,
  onReset,
  canClose,
}: StorageModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={canClose ? onClose : undefined}
    title="Transmission Storage Matrix"
    maxWidth="md"
  >
    <div className="flex flex-col gap-6">
      <Text as="p" className="text-sm text-slate-300 text-center">
        Commander, where should we securely persist your command network state?
      </Text>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onSelectLocal}
          className="cinematic-card flex flex-col items-center justify-center p-6 gap-3 group hover:border-brand-primary/50 transition-colors cursor-pointer text-left"
        >
          <HardDrive
            size={32}
            className="text-slate-400 group-hover:text-brand-primary transition-colors"
          />
          <Text as="span" className="font-bold text-slate-200">
            Local Deck
          </Text>
          <Text variant="muted" as="span" className="text-xs text-center">
            Plays strictly on this terminal.
          </Text>
        </button>

        <button
          onClick={onSelectCloud}
          className="cinematic-card flex flex-col items-center justify-center p-6 gap-3 group hover:border-brand-success/50 transition-colors cursor-pointer text-left"
        >
          <Cloud
            size={32}
            className="text-slate-400 group-hover:text-brand-success transition-colors"
          />
          <Text as="span" className="font-bold text-slate-200">
            Network Cloud
          </Text>
          <Text variant="muted" as="span" className="text-xs text-center">
            Syncs across terminals. Requires link.
          </Text>
        </button>
      </div>

      <div className="border-t border-cinematic-border pt-6 mt-2 pb-2">
        <Text as="p" variant="muted" className="text-xs text-center mb-4 uppercase tracking-wider">
          Critical Failure Protocol
        </Text>
        <Button
          variant="secondary"
          fullWidth
          onClick={onReset}
          className="text-brand-danger hover:bg-brand-danger/10 hover:border-brand-danger/50 text-sm"
        >
          <Trash2 size={16} /> Reset Command State
        </Button>
      </div>
    </div>
  </Modal>
);

export default StorageModal;
