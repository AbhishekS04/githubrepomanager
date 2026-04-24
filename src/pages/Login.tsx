import React from 'react';
import { motion } from 'framer-motion';
import { GithubIcon } from '../components/ui/GithubIcon';
import { Button } from '../components/ui/Button';
import { loginWithGitHub } from '../lib/auth';

export const Login: React.FC = () => {
  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Glass card */}
        <div className="glass-strong rounded-2xl p-8 flex flex-col items-center gap-6 text-center">
          {/* Icon */}
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <GithubIcon className="h-7 w-7 text-white/80" />
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight text-white">
              RepoManager
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Bulk-manage all your GitHub repositories from a single, clean dashboard.
            </p>
          </div>

          {/* CTA */}
          <Button
            onClick={loginWithGitHub}
            className="w-full h-11 gap-2.5 rounded-xl font-medium text-sm"
            style={{
              background: 'white',
              color: '#0a0a0a',
              border: 'none',
            }}
          >
            <GithubIcon className="h-4 w-4" />
            Continue with GitHub
          </Button>

          {/* Fine print */}
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Uses OAuth · No password required · Scopes: repo, delete_repo, user
          </p>
        </div>
      </motion.div>
    </div>
  );
};
