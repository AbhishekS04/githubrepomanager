import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogOut } from 'lucide-react';
import { GithubIcon } from '../ui/GithubIcon';
import { motion } from 'framer-motion';

import { NotificationBell } from './NotificationBell';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen" style={{ background: 'hsl(0 0% 4%)' }}>
      {/* Apple-style floating pill navbar */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="floating-nav flex items-center justify-between gap-4 px-5 py-2.5 w-full max-w-3xl"
        >
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-full bg-white/8">
              <GithubIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight font-mono text-white/90">
              GitSweep
            </span>
          </div>

          {/* User info + Notifications + logout */}
          {user && (
            <div className="flex items-center gap-3">
              <NotificationBell />
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="h-6 w-6 rounded-full ring-1 ring-white/15"
                />
                <span className="text-xs text-white/50 font-mono hidden sm:block">
                  {user.login}
                </span>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-full text-white/40 hover:text-white/80 hover:bg-white/8 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </motion.nav>
      </div>

      {/* Page content with top padding for navbar */}
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-8">
        {children}
      </main>
    </div>
  );
};
