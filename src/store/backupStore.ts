import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BackupLog {
  id: string;
  repoName: string;
  repoFullName: string;
  owner: string;
  timestamp: number;
  action: 'delete' | 'leave' | 'transfer' | 'manual';
  status: 'success' | 'failed';
  details?: string;
  fileId?: string;
}

interface BackupState {
  logs: BackupLog[];
  addLog: (log: Omit<BackupLog, 'id' | 'timestamp'>) => void;
  updateLog: (id: string, updates: Partial<BackupLog>) => void;
  clearLogs: () => void;
}

export const useBackupStore = create<BackupState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (log) => {
        const newLog: BackupLog = {
          ...log,
          id: Math.random().toString(36).substring(2, 11),
          timestamp: Date.now(),
        };
        set((state) => ({ logs: [newLog, ...state.logs] }));
      },
      updateLog: (id, updates) => {
        set((state) => ({
          logs: state.logs.map((log) => (log.id === id ? { ...log, ...updates } : log)),
        }));
      },
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'gitsweep-backup-vault',
    }
  )
);
