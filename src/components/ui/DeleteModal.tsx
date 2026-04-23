import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
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

  const isBulk = repoCount > 1;
  const canDelete = isBulk 
    ? understood 
    : confirmText === singleRepoName;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: '20px' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: '20px' }}
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-destructive/20 bg-background p-6 shadow-lg sm:rounded-lg"
          >
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-lg font-semibold tracking-tight text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Delete {isBulk ? `${repoCount} Repositories` : 'Repository'}
              </h2>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete 
                {isBulk ? ` ${repoCount} selected repositories ` : ` the repository `}
                and remove all associated data, commits, branches, and issues.
              </p>
            </div>

            <div className="my-4">
              {isBulk ? (
                <label className="flex items-center space-x-3 rounded-md border border-destructive/20 bg-destructive/10 p-4 cursor-pointer">
                  <Checkbox 
                    checked={understood} 
                    onCheckedChange={setUnderstood} 
                  />
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I understand this cannot be undone and wish to delete {repoCount} repositories.
                  </span>
                </label>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Please type <strong className="select-all font-mono">{singleRepoName}</strong> to confirm.
                  </label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={singleRepoName}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                disabled={!canDelete || isDeleting}
                isLoading={isDeleting}
                onClick={onConfirm}
              >
                I understand the consequences, delete {isBulk ? 'them' : 'it'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
