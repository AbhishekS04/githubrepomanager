import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelectionStore } from '../../store/selectionStore';
import { useRepoStore } from '../../store/repoStore';
import {
  Download, Lock, Unlock, Archive, ArchiveRestore,
  Trash2, X, Send,
} from 'lucide-react';
import {
  updateRepoVisibility, updateRepoArchived,
  downloadRepoZip, deleteRepo,
} from '../../lib/github';
import { backupRepoToTelegram } from '../../lib/telegram';
import { DeleteModal } from '../ui/DeleteModal';
import type { Repo } from '../../lib/github';

type ProgressStep = 'backup' | 'delete' | 'action';
interface Progress { current: number; total: number; step: ProgressStep; repoName?: string; }
type BackupWarning = { repo: Repo; error: string };

export const ActionBar: React.FC = () => {
  const { selectedIds, deselectAll } = useSelectionStore();
  const { repos, updateRepoLocally, removeReposLocally } = useRepoStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [backupWarning, setBackupWarning] = useState<BackupWarning | null>(null);
  const [skipBackupForCurrent, setSkipBackupForCurrent] = useState<((v: boolean) => void) | null>(null);

  const selectedRepos = repos.filter(r => selectedIds.has(r.id));
  const count = selectedIds.size;

  const handleBulkAction = async (
    step: ProgressStep,
    fn: (owner: string, repo: string) => Promise<void>,
    localFn?: (id: number) => void,
  ) => {
    setIsProcessing(true);
    setProgress({ current: 0, total: count, step });
    for (let i = 0; i < selectedRepos.length; i++) {
      const repo = selectedRepos[i];
      try { await fn(repo.owner.login, repo.name); if (localFn) localFn(repo.id); }
      catch (e) { console.error(e); }
      setProgress({ current: i + 1, total: count, step, repoName: repo.name });
    }
    setIsProcessing(false);
    setProgress(null);
    deselectAll();
  };

  const handleMakePrivate  = () => handleBulkAction('action', (o,r) => updateRepoVisibility(o,r,true),  id => updateRepoLocally(id, { private: true }));
  const handleMakePublic   = () => handleBulkAction('action', (o,r) => updateRepoVisibility(o,r,false), id => updateRepoLocally(id, { private: false }));
  const handleArchive      = () => handleBulkAction('action', (o,r) => updateRepoArchived(o,r,true),    id => updateRepoLocally(id, { archived: true }));
  const handleUnarchive    = () => handleBulkAction('action', (o,r) => updateRepoArchived(o,r,false),   id => updateRepoLocally(id, { archived: false }));
  const handleDownloadZip  = () => handleBulkAction('action', (o,r) => downloadRepoZip(o,r));

  const handleDelete = async (shouldBackup: boolean) => {
    setDeleteModalOpen(false);
    setIsProcessing(true);
    const idsToRemove: number[] = [];
    for (let i = 0; i < selectedRepos.length; i++) {
      const repo = selectedRepos[i];
      if (shouldBackup) {
        setProgress({ current: i + 1, total: selectedRepos.length, step: 'backup', repoName: repo.name });
        const result = await backupRepoToTelegram(repo.owner.login, repo.name, {
          fullName: repo.full_name, description: repo.description,
          isPrivate: repo.private, language: repo.language, stars: repo.stargazers_count,
        });
        if (!result.ok) {
          const go = await new Promise<boolean>(resolve => {
            setBackupWarning({ repo, error: result.error || 'Unknown error' });
            setSkipBackupForCurrent(() => resolve);
          });
          setBackupWarning(null); setSkipBackupForCurrent(null);
          if (!go) continue;
        }
      }
      setProgress({ current: i + 1, total: selectedRepos.length, step: 'delete', repoName: repo.name });
      try { await deleteRepo(repo.owner.login, repo.name); idsToRemove.push(repo.id); }
      catch (e) { console.error(e); }
    }
    removeReposLocally(idsToRemove);
    setIsProcessing(false);
    setProgress(null);
    deselectAll();
  };

  const progressBg = progress?.step === 'backup' ? '#3b82f6' : progress?.step === 'delete' ? '#e13535' : 'rgba(255,255,255,0.5)';
  const progressLabel = progress?.step === 'backup' ? 'Backing up' : progress?.step === 'delete' ? 'Deleting' : 'Processing';

  const ACTIONS = [
    { label: 'Private',   icon: <Lock size={14} />,           fn: handleMakePrivate },
    { label: 'Public',    icon: <Unlock size={14} />,         fn: handleMakePublic },
    { label: 'Archive',   icon: <Archive size={14} />,        fn: handleArchive },
    { label: 'Unarchive', icon: <ArchiveRestore size={14} />, fn: handleUnarchive },
    { label: 'ZIP',       icon: <Download size={14} />,       fn: handleDownloadZip },
  ];

  /* shared pill style — matches the floating nav */
  const pillStyle: React.CSSProperties = {
    background: 'rgba(10,10,10,0.82)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '9999px',
    boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
  };

  const divStyle: React.CSSProperties = {
    width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)', flexShrink: 0,
  };

  return (
    <>
      {/* ─── Bottom-center dock pill ─────────────────────────── */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ y: 72, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={{ y: 72,  opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: 0,
              right: 0,
              zIndex: 50,
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{ pointerEvents: 'auto', maxWidth: 'calc(100vw - 32px)' }}>
            <div style={{ ...pillStyle, display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`
                ::-webkit-scrollbar { display: none; }
              `}</style>

              {/* Count badge */}
              <span style={{
                padding: '3px 10px', borderRadius: '9999px', fontSize: '12px',
                fontWeight: 600, fontFamily: 'JetBrains Mono, monospace',
                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)',
                whiteSpace: 'nowrap',
              }}>
                {count} <span className="hidden sm:inline">selected</span>
              </span>

              <div style={divStyle} />

              {/* Progress or action buttons */}
              {progress ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '220px', padding: '2px 8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.4)' }}>
                    <span>
                      {progressLabel}
                      {progress.repoName && <span style={{ color: 'rgba(255,255,255,0.7)' }}> · {progress.repoName}</span>}
                    </span>
                    <span>{progress.current}/{progress.total}</span>
                  </div>
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: progressBg, borderRadius: '99px' }}
                      animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  {ACTIONS.map(({ label, icon, fn }) => (
                    <button
                      key={label}
                      onClick={fn}
                      disabled={isProcessing}
                      title={label}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '5px 10px', borderRadius: '9999px',
                        background: 'transparent', border: 'none',
                        color: 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: 500,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.95)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                      }}
                    >
                      {icon}
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              )}

              <div style={divStyle} />

              {/* Delete */}
              <button
                onClick={() => setDeleteModalOpen(true)}
                disabled={isProcessing}
                title="Delete selected"
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '5px 12px', borderRadius: '9999px',
                  background: 'rgba(225,53,53,0.12)', border: '1px solid rgba(225,53,53,0.2)',
                  color: '#e13535', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(225,53,53,0.22)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(225,53,53,0.12)'; }}
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Delete</span>
              </button>

              {/* Dismiss */}
              <button
                onClick={deselectAll}
                disabled={isProcessing}
                title="Clear selection"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '28px', height: '28px', borderRadius: '9999px',
                  background: 'transparent', border: 'none',
                  color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s', flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
              >
                <X size={13} />
              </button>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Backup Failed Modal ──────────────────────────────── */}
      <AnimatePresence>
        {backupWarning && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 61, width: '100%', maxWidth: '360px', padding: '0 16px' }}
            >
              <div style={{ background: 'rgba(12,12,12,0.97)', backdropFilter: 'blur(40px)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '8px', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '12px', flexShrink: 0 }}>
                    <Send size={14} style={{ color: '#eab308' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>Telegram Backup Failed</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                      Could not back up <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.7)' }}>{backupWarning.repo.name}</code>
                    </p>
                    <p style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', marginTop: '8px', padding: '6px 8px', background: 'rgba(225,53,53,0.08)', border: '1px solid rgba(225,53,53,0.15)', borderRadius: '8px', color: '#e13535', wordBreak: 'break-all' }}>
                      {backupWarning.error}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => skipBackupForCurrent?.(true)} style={{ height: '40px', background: '#e13535', color: 'white', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                    Delete anyway (no backup)
                  </button>
                  <button onClick={() => skipBackupForCurrent?.(false)} style={{ height: '40px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                    Skip this repo (keep on GitHub)
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Delete Modal ────────────────────────────────────── */}
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
