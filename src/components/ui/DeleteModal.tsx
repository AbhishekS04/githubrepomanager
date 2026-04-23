import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { AlertTriangle, Send } from 'lucide-react';
import { isTelegramConfigured } from '../../lib/telegram';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (shouldBackup: boolean) => void;
  repoCount: number;
  singleRepoName?: string;
  isDeleting: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  repoCount,
  singleRepoName,
  isDeleting,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [understood, setUnderstood] = useState(false);
  const telegramReady = isTelegramConfigured();
  const [shouldBackup, setShouldBackup] = useState(telegramReady);

  const isBulk = repoCount > 1;
  const canDelete = isBulk
    ? understood
    : confirmText === singleRepoName;

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      setUnderstood(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: '20px' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: '20px' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-destructive/20 bg-background p-6 shadow-2xl sm:rounded-xl"
          >
            {/* Header */}
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-lg font-semibold tracking-tight text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                Delete {isBulk ? `${repoCount} Repositories` : 'Repository'}
              </h2>
              <p className="text-sm text-muted-foreground">
                This action <strong>cannot be undone</strong>. This will permanently delete{' '}
                {isBulk ? `${repoCount} selected repositories` : `the repository`} and remove all
                associated data, commits, branches, and issues from GitHub.
              </p>
            </div>

            {/* Telegram Backup Toggle */}
            <div
              className={`rounded-lg border p-4 flex items-start gap-3 transition-colors ${
                telegramReady
                  ? 'border-blue-500/30 bg-blue-500/5 cursor-pointer'
                  : 'border-border/30 bg-accent/20 opacity-60 cursor-not-allowed'
              }`}
              onClick={() => telegramReady && setShouldBackup(v => !v)}
            >
              <div className="mt-0.5 flex-shrink-0">
                <Checkbox
                  checked={shouldBackup}
                  onCheckedChange={(v) => telegramReady && setShouldBackup(v)}
                  disabled={!telegramReady}
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Send className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-sm font-medium">
                    Backup to Telegram before deleting
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {telegramReady
                    ? `Each repo will be zipped and sent to your Telegram chat. Deletion only proceeds after a successful backup.`
                    : `Configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local to enable.`}
                </p>
              </div>
            </div>

            {/* Confirmation */}
            <div>
              {isBulk ? (
                <label className="flex items-center space-x-3 rounded-md border border-destructive/20 bg-destructive/10 p-4 cursor-pointer">
                  <Checkbox
                    checked={understood}
                    onCheckedChange={setUnderstood}
                  />
                  <span className="text-sm font-medium leading-none">
                    I understand this cannot be undone and wish to delete {repoCount} repositories.
                  </span>
                </label>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Please type{' '}
                    <strong className="select-all font-mono text-destructive">{singleRepoName}</strong>{' '}
                    to confirm.
                  </label>
                  <input
                    type="text"
                    autoFocus
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={singleRepoName}
                    disabled={isDeleting}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={!canDelete || isDeleting}
                isLoading={isDeleting}
                onClick={() => onConfirm(shouldBackup)}
              >
                {shouldBackup ? '📦 Backup & Delete' : '🗑 Delete Permanently'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
