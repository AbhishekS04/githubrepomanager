import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelectionStore } from '../../store/selectionStore';
import { useRepoStore } from '../../store/repoStore';
import { Button } from '../ui/Button';
import { Download, Lock, Unlock, Archive, ArchiveRestore, Trash2, X } from 'lucide-react';
import { updateRepoVisibility, updateRepoArchived, downloadRepoZip, deleteRepo } from '../../lib/github';
import { DeleteModal } from '../ui/DeleteModal';

export const ActionBar: React.FC = () => {
  const { selectedIds, deselectAll } = useSelectionStore();
  const { repos, updateRepoLocally, removeReposLocally } = useRepoStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; action: string } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const selectedRepos = repos.filter(r => selectedIds.has(r.id));
  const count = selectedIds.size;

  const handleBulkAction = async (
    actionName: string, 
    actionFn: (owner: string, repo: string) => Promise<void>,
    localUpdateFn?: (repoId: number) => void
  ) => {
    setIsProcessing(true);
    setProgress({ current: 0, total: count, action: actionName });
    
    let successCount = 0;
    
    for (let i = 0; i < selectedRepos.length; i++) {
      const repo = selectedRepos[i];
      try {
        await actionFn(repo.owner.login, repo.name);
        successCount++;
        if (localUpdateFn) localUpdateFn(repo.id);
      } catch (error) {
        console.error(`Failed to ${actionName} ${repo.name}`, error);
      }
      setProgress({ current: i + 1, total: count, action: actionName });
    }
    
    setIsProcessing(false);
    setProgress(null);
    deselectAll();
    // In a real app, we'd show a toast with successCount here
  };

  const handleMakePrivate = () => handleBulkAction('Making private...', 
    (owner, repo) => updateRepoVisibility(owner, repo, true),
    (id) => updateRepoLocally(id, { private: true })
  );

  const handleMakePublic = () => handleBulkAction('Making public...', 
    (owner, repo) => updateRepoVisibility(owner, repo, false),
    (id) => updateRepoLocally(id, { private: false })
  );

  const handleArchive = () => handleBulkAction('Archiving...', 
    (owner, repo) => updateRepoArchived(owner, repo, true),
    (id) => updateRepoLocally(id, { archived: true })
  );

  const handleUnarchive = () => handleBulkAction('Unarchiving...', 
    (owner, repo) => updateRepoArchived(owner, repo, false),
    (id) => updateRepoLocally(id, { archived: false })
  );

  const handleDownloadZip = () => handleBulkAction('Downloading...', 
    (owner, repo) => downloadRepoZip(owner, repo)
  );

  const handleDelete = async () => {
    setIsProcessing(true);
    setProgress({ current: 0, total: count, action: 'Deleting...' });
    
    const idsToRemove: number[] = [];
    
    for (let i = 0; i < selectedRepos.length; i++) {
      const repo = selectedRepos[i];
      try {
        await deleteRepo(repo.owner.login, repo.name);
        idsToRemove.push(repo.id);
      } catch (error) {
        console.error(`Failed to delete ${repo.name}`, error);
      }
      setProgress({ current: i + 1, total: count, action: 'Deleting...' });
    }
    
    removeReposLocally(idsToRemove);
    setDeleteModalOpen(false);
    setIsProcessing(false);
    setProgress(null);
    deselectAll();
  };

  return (
    <>
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4"
          >
            <div className="bg-popover border border-border/50 shadow-2xl rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
              
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

              {progress ? (
                <div className="flex-1 w-full max-w-md flex flex-col gap-1.5 px-4">
                  <div className="flex justify-between text-xs font-medium font-mono text-muted-foreground">
                    <span>{progress.action}</span>
                    <span>{progress.current} / {progress.total}</span>
                  </div>
                  <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end w-full sm:w-auto">
                  <Button variant="outline" size="sm" onClick={handleMakePrivate} title="Make Private">
                    <Lock className="w-4 h-4 mr-2" /> Private
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleMakePublic} title="Make Public">
                    <Unlock className="w-4 h-4 mr-2" /> Public
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleArchive} title="Archive">
                    <Archive className="w-4 h-4 mr-2" /> Archive
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleUnarchive} title="Unarchive">
                    <ArchiveRestore className="w-4 h-4 mr-2" /> Unarchive
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadZip} title="Download ZIP">
                    <Download className="w-4 h-4 mr-2" /> ZIP
                  </Button>
                  <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteModalOpen(true)} title="Delete">
                    <Trash2 className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Delete</span>
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
