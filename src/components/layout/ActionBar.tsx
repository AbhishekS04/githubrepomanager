import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelectionStore } from '../../store/selectionStore';
import { useRepoStore } from '../../store/repoStore';
import { Button } from '../ui/Button';
import { Download, Lock, Unlock, Archive, ArchiveRestore, Trash2, X, Send } from 'lucide-react';
import { updateRepoVisibility, updateRepoArchived, downloadRepoZip, deleteRepo } from '../../lib/github';
import { backupRepoToTelegram } from '../../lib/telegram';
import { DeleteModal } from '../ui/DeleteModal';
import type { Repo } from '../../lib/github';

type ProgressStep = 'backup' | 'delete' | 'action';

interface Progress {
  current: number;
  total: number;
  action: string;
  step: ProgressStep;
  repoName?: string;
}

type BackupWarning = {
  repo: Repo;
  error: string;
};

export const ActionBar: React.FC = () => {
  const { selectedIds, deselectAll } = useSelectionStore();
  const { repos, updateRepoLocally, removeReposLocally } = useRepoStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // When a backup fails, we show a warning prompt
  const [backupWarning, setBackupWarning] = useState<BackupWarning | null>(null);
  const [skipBackupForCurrent, setSkipBackupForCurrent] = useState<((skip: boolean) => void) | null>(null);

  const selectedRepos = repos.filter(r => selectedIds.has(r.id));
  const count = selectedIds.size;

  // ------------------------------------------------------------------
  // Generic bulk action runner (for non-delete actions)
  // ------------------------------------------------------------------
  const handleBulkAction = async (
    actionName: string,
    actionFn: (owner: string, repo: string) => Promise<void>,
    localUpdateFn?: (repoId: number) => void
  ) => {
    setIsProcessing(true);
    setProgress({ current: 0, total: count, action: actionName, step: 'action' });

    for (let i = 0; i < selectedRepos.length; i++) {
      const repo = selectedRepos[i];
      try {
        await actionFn(repo.owner.login, repo.name);
        if (localUpdateFn) localUpdateFn(repo.id);
      } catch (error) {
        console.error(`Failed to ${actionName} ${repo.name}`, error);
      }
      setProgress({ current: i + 1, total: count, action: actionName, step: 'action' });
    }

    setIsProcessing(false);
    setProgress(null);
    deselectAll();
  };

  const handleMakePrivate = () => handleBulkAction('Making private',
    (owner, repo) => updateRepoVisibility(owner, repo, true),
    (id) => updateRepoLocally(id, { private: true })
  );

  const handleMakePublic = () => handleBulkAction('Making public',
    (owner, repo) => updateRepoVisibility(owner, repo, false),
    (id) => updateRepoLocally(id, { private: false })
  );

  const handleArchive = () => handleBulkAction('Archiving',
    (owner, repo) => updateRepoArchived(owner, repo, true),
    (id) => updateRepoLocally(id, { archived: true })
  );

  const handleUnarchive = () => handleBulkAction('Unarchiving',
    (owner, repo) => updateRepoArchived(owner, repo, false),
    (id) => updateRepoLocally(id, { archived: false })
  );

  const handleDownloadZip = () => handleBulkAction('Downloading ZIPs',
    (owner, repo) => downloadRepoZip(owner, repo)
  );

  // ------------------------------------------------------------------
  // Delete flow with optional Telegram backup
  // ------------------------------------------------------------------
  const handleDelete = async (shouldBackup: boolean) => {
    setDeleteModalOpen(false);
    setIsProcessing(true);

    const idsToRemove: number[] = [];
    const total = selectedRepos.length;

    for (let i = 0; i < total; i++) {
      const repo = selectedRepos[i];

      // ---- STEP 1: Backup to Telegram (if requested) ----
      if (shouldBackup) {
        setProgress({
          current: i + 1, total,
          action: 'Backing up',
          step: 'backup',
          repoName: repo.name,
        });

        const result = await backupRepoToTelegram(repo.owner.login, repo.name, {
          fullName: repo.full_name,
          description: repo.description,
          isPrivate: repo.private,
          language: repo.language,
          stars: repo.stargazers_count,
        });

        if (!result.ok) {
          // Ask the user whether to skip this repo or force-delete without backup
          const shouldContinue = await new Promise<boolean>((resolve) => {
            setBackupWarning({ repo, error: result.error || 'Unknown backup error' });
            setSkipBackupForCurrent(() => resolve);
          });
          setBackupWarning(null);
          setSkipBackupForCurrent(null);

          if (!shouldContinue) {
            // Skip this repo entirely
            setProgress({ current: i + 1, total, action: 'Skipped', step: 'backup', repoName: repo.name });
            continue;
          }
          // else: user accepted force-delete without backup, fall through
        }
      }

      // ---- STEP 2: Delete from GitHub ----
      setProgress({
        current: i + 1, total,
        action: 'Deleting',
        step: 'delete',
        repoName: repo.name,
      });

      try {
        await deleteRepo(repo.owner.login, repo.name);
        idsToRemove.push(repo.id);
      } catch (error) {
        console.error(`Failed to delete ${repo.name}`, error);
      }
    }

    removeReposLocally(idsToRemove);
    setIsProcessing(false);
    setProgress(null);
    deselectAll();
  };

  // Progress bar color by step
  const progressColor = progress?.step === 'backup'
    ? 'bg-blue-500'
    : progress?.step === 'delete'
    ? 'bg-destructive'
    : 'bg-primary';

  // Progress label icon
  const progressIcon = progress?.step === 'backup' ? '📦' : progress?.step === 'delete' ? '🗑' : '⚙️';

  return (
    <>
      {/* ---- Main Action Bar ---- */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4"
          >
            <div className="bg-popover/95 border border-border/60 shadow-2xl rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">

              {/* Selection count */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-md text-sm font-medium font-mono whitespace-nowrap">
                  {count} selected
                </div>
                <button
                  onClick={deselectAll}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md sm:hidden"
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress indicator or Action buttons */}
              {progress ? (
                <div className="flex-1 w-full max-w-md flex flex-col gap-1.5 px-4">
                  <div className="flex justify-between text-xs font-medium font-mono text-muted-foreground">
                    <span>
                      {progressIcon} {progress.action}{progress.repoName ? ` ${progress.repoName}` : ''}...
                    </span>
                    <span>{progress.current} / {progress.total}</span>
                  </div>
                  <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${progressColor} transition-colors duration-300`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end w-full sm:w-auto">
                  <Button variant="outline" size="sm" onClick={handleMakePrivate} title="Make Private" disabled={isProcessing}>
                    <Lock className="w-4 h-4 mr-2" /> Private
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleMakePublic} title="Make Public" disabled={isProcessing}>
                    <Unlock className="w-4 h-4 mr-2" /> Public
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleArchive} title="Archive" disabled={isProcessing}>
                    <Archive className="w-4 h-4 mr-2" /> Archive
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleUnarchive} title="Unarchive" disabled={isProcessing}>
                    <ArchiveRestore className="w-4 h-4 mr-2" /> Unarchive
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadZip} title="Download ZIP" disabled={isProcessing}>
                    <Download className="w-4 h-4 mr-2" /> ZIP
                  </Button>
                  <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteModalOpen(true)}
                    title="Delete"
                    disabled={isProcessing}
                  >
                    <Trash2 className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>

                  <button
                    onClick={deselectAll}
                    className="p-1.5 ml-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md hidden sm:block"
                    title="Clear selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Backup Warning Modal ---- */}
      <AnimatePresence>
        {backupWarning && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="fixed left-[50%] top-[50%] z-[61] w-full max-w-md translate-x-[-50%] translate-y-[-50%] border border-yellow-500/30 bg-background p-6 shadow-2xl sm:rounded-xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <Send className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-base">Telegram Backup Failed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Could not back up <strong className="font-mono">{backupWarning.repo.name}</strong> to Telegram.
                  </p>
                  <p className="text-xs text-destructive mt-1 font-mono">{backupWarning.error}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                How would you like to proceed for this repository?
              </p>

              <div className="flex flex-col gap-2">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => skipBackupForCurrent?.(true)}
                >
                  🗑 Delete anyway (no backup)
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => skipBackupForCurrent?.(false)}
                >
                  ⏭ Skip this repo (keep it on GitHub)
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---- Delete Confirmation Modal ---- */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        repoCount={count}
        singleRepoName={count === 1 ? selectedRepos[0]?.name : undefined}
        isDeleting={isProcessing}
      />
    </>
  );
};
