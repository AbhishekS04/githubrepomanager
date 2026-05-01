import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, Inbox, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { listInvitations, acceptInvitation, declineInvitation } from '../../lib/github';
import { useRepoStore } from '../../store/repoStore';
// import { useAuthStore } from '../../store/authStore';

export const NotificationBell: React.FC = () => {
  const [invites, setInvites] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [actioningId, setActioningId] = useState<number | null>(null);
  const { fetchRepos } = useRepoStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadInvites = async () => {
    try {
      const data = await listInvitations();
      setInvites(data);
    } catch (e) {
      console.error('Failed to load invitations', e);
    }
  };

  useEffect(() => {
    loadInvites();
    const timer = setInterval(loadInvites, 30000); // Poll every 30s
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = async (id: number, type: 'accept' | 'decline') => {
    setActioningId(id);
    try {
      if (type === 'accept') {
        await acceptInvitation(id);
        // Refresh repos if accepted
        fetchRepos();
      } else {
        await declineInvitation(id);
      }
      await loadInvites();
    } catch (e) {
      console.error(`Failed to ${type} invitation`, e);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '42px', height: '42px', borderRadius: '14px',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', color: 'rgba(255,255,255,0.7)',
        }}
      >
        <Bell size={20} />
        {invites.length > 0 && (
          <span style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '10px', height: '10px', borderRadius: '50%',
            background: '#ef4444', border: '2px solid #0a0a0a',
          }} />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            data-lenis-prevent
            style={{
              position: 'absolute', top: '52px', right: 0,
              width: '320px', maxHeight: '400px', overflowY: 'auto',
              background: 'rgba(15,15,15,0.98)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)', zIndex: 100,
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>Notifications</h3>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '20px' }}>
                {invites.length} Pending
              </span>
            </div>

            {invites.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.4 }}>
                <Inbox size={32} style={{ margin: '0 auto 12px', display: 'block' }} />
                <p style={{ fontSize: '13px' }}>All caught up!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {invites.map((invite) => (
                  <div
                    key={invite.id}
                    style={{
                      padding: '12px', borderRadius: '14px',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <img
                        src={invite.inviter.avatar_url}
                        style={{ width: '32px', height: '32px', borderRadius: '8px' }}
                        alt=""
                      />
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: '13px', color: 'white', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {invite.repository.full_name}
                        </p>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                          Invited by {invite.inviter.login}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleAction(invite.id, 'accept')}
                        disabled={actioningId === invite.id}
                        style={{
                          flex: 1, height: '32px', borderRadius: '8px', border: 'none',
                          background: '#3b82f6', color: 'white', fontSize: '12px', fontWeight: 600,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                        }}
                      >
                        {actioningId === invite.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(invite.id, 'decline')}
                        disabled={actioningId === invite.id}
                        style={{
                          width: '32px', height: '32px', borderRadius: '8px',
                          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
