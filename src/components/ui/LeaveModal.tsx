import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Send, Check } from 'lucide-react';
import { isTelegramConfigured } from '../../lib/telegram';

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (shouldBackup: boolean) => void;
  repoCount: number;
  isProcessing: boolean;
}

export const LeaveModal: React.FC<LeaveModalProps> = ({
  isOpen, onClose, onConfirm, repoCount, isProcessing,
}) => {
  const telegramReady = isTelegramConfigured();
  const [shouldBackup, setShouldBackup] = useState(telegramReady);

  const isBulk = repoCount > 1;

  const handleClose = () => {
    if (!isProcessing) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 34 }}
            style={{
              position: 'fixed', inset: 0,
              zIndex: 51,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 16px',
              pointerEvents: 'none',
            }}
          >
            <div style={{ pointerEvents: 'auto', width: '100%', maxWidth: '400px' }}>
              <div style={{
                background: 'rgba(13,13,13,0.98)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '20px',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)',
                overflow: 'hidden',
              }}>
                <div style={{ height: '3px', background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)' }} />

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                    }}>
                      <LogOut size={18} style={{ color: '#3b82f6' }} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '5px' }}>
                        Leave {isBulk ? `${repoCount} Contributions` : 'Contribution'}
                      </h2>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                        You will remove yourself as a collaborator. Access to these {isBulk ? 'repositories' : 'repository'} will be <span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>lost immediately</span>.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => telegramReady && setShouldBackup(v => !v)}
                    style={{
                      display: 'flex', gap: '12px', alignItems: 'flex-start',
                      padding: '14px', borderRadius: '14px', marginBottom: '20px',
                      cursor: telegramReady ? 'pointer' : 'default',
                      opacity: telegramReady ? 1 : 0.45,
                      background: shouldBackup && telegramReady ? 'rgba(59,130,246,0.07)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${shouldBackup && telegramReady ? 'rgba(59,130,246,0.22)' : 'rgba(255,255,255,0.07)'}`,
                    }}
                  >
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: shouldBackup && telegramReady ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${shouldBackup && telegramReady ? '#3b82f6' : 'rgba(255,255,255,0.15)'}`,
                    }}>
                      {shouldBackup && telegramReady && <Check size={11} strokeWidth={3} style={{ color: 'white' }} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <Send size={13} style={{ color: telegramReady ? '#3b82f6' : 'rgba(255,255,255,0.3)' }} />
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                          Backup to Telegram first
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                        Highly recommended if you want to keep a copy of your contributions.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleClose}
                      disabled={isProcessing}
                      style={{
                        flex: 1, height: '42px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                        color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => onConfirm(shouldBackup)}
                      disabled={isProcessing}
                      style={{
                        flex: 1, height: '42px', borderRadius: '12px', border: 'none',
                        background: shouldBackup ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : 'rgba(255,255,255,0.08)',
                        color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                        boxShadow: shouldBackup ? '0 4px 16px rgba(59,130,246,0.35)' : 'none',
                      }}
                    >
                      {isProcessing ? 'Processing...' : shouldBackup ? 'Backup & Leave' : 'Leave Repo'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
