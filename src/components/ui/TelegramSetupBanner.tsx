import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronDown, ChevronUp, X } from 'lucide-react';
import { isTelegramConfigured } from '../../lib/telegram';

const DISMISSED_KEY = 'telegram-banner-dismissed';

export const TelegramSetupBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem(DISMISSED_KEY) === 'true';
  });
  const [expanded, setExpanded] = useState(false);

  // Don't render if already configured or dismissed
  if (isTelegramConfigured() || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/5 overflow-hidden"
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-blue-500/15 text-blue-400">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Enable Telegram Backup</p>
              <p className="text-xs text-muted-foreground">
                Auto-backup deleted repos as ZIPs to your Telegram chat before they're gone forever.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setExpanded(v => !v)}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors text-xs flex items-center gap-1"
            >
              {expanded ? <>Hide<ChevronUp className="h-3 w-3" /></> : <>How to<ChevronDown className="h-3 w-3" /></>}
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
              title="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-blue-500/15 px-4 py-4 space-y-3 text-sm text-muted-foreground">
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    Open Telegram and message{' '}
                    <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline font-mono">@BotFather</a>
                    {' '}→ send <code className="bg-accent px-1.5 py-0.5 rounded font-mono text-xs">/newbot</code> → follow steps → copy the <strong>Bot Token</strong>.
                  </li>
                  <li>
                    Message{' '}
                    <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline font-mono">@userinfobot</a>
                    {' '}to get your <strong>Chat ID</strong>.
                  </li>
                  <li>
                    Start your bot by sending it{' '}
                    <code className="bg-accent px-1.5 py-0.5 rounded font-mono text-xs">/start</code>
                    {' '}in a direct message — required before it can send you files.
                  </li>
                  <li>
                    Add to your <code className="bg-accent px-1.5 py-0.5 rounded font-mono text-xs">.env.local</code>:
                    <pre className="mt-1.5 rounded-md bg-background/60 border border-border/40 p-3 text-xs font-mono overflow-x-auto">
{`TELEGRAM_BOT_TOKEN=1234567890:ABCdef...
TELEGRAM_CHAT_ID=987654321
VITE_TELEGRAM_CONFIGURED=true`}
                    </pre>
                  </li>
                  <li>Restart <code className="bg-accent px-1.5 py-0.5 rounded font-mono text-xs">npm run dev</code> — done! 🎉</li>
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
