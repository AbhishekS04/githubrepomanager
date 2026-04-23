import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogOut } from 'lucide-react';
import { GithubIcon } from '../ui/GithubIcon';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono font-semibold tracking-tight text-lg">
            <GithubIcon className="h-5 w-5 text-primary" />
            <span>RepoManager</span>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <img 
                  src={user.avatar_url} 
                  alt={user.login} 
                  className="w-6 h-6 rounded-full border border-border"
                />
                <span className="hidden sm:inline-block font-mono">{user.login}</span>
              </div>
              <button 
                onClick={logout}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
