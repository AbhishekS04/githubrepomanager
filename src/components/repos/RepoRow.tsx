import React from 'react';
import type { Repo } from '../../lib/github';
import { Checkbox } from '../ui/Checkbox';
import { Lock, Unlock, Archive, GitFork, Star, HardDrive, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

interface RepoItemProps {
  repo: Repo;
  isSelected: boolean;
  onToggle: (id: number) => void;
  index: number;
}

const formatDistanceToNow = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  return `${Math.floor(diffInMonths / 12)}y ago`;
};

const formatSize = (kb: number) => {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const getLanguageColor = (lang: string | null) => {
  if (!lang) return 'bg-muted';
  const colors: Record<string, string> = {
    TypeScript: 'bg-blue-400',
    JavaScript: 'bg-yellow-400',
    Python: 'bg-blue-500',
    Go: 'bg-cyan-400',
    Rust: 'bg-orange-500',
    Java: 'bg-red-500',
    CSS: 'bg-purple-500',
    HTML: 'bg-orange-600',
    Ruby: 'bg-red-600',
    Shell: 'bg-green-500',
    C: 'bg-gray-500',
    'C++': 'bg-pink-500',
    'C#': 'bg-green-600',
  };
  return colors[lang] || 'bg-accent';
};

export const RepoRow: React.FC<RepoItemProps> = ({ repo, isSelected, onToggle, index }) => {
  const { user } = useAuthStore();
  const isContribution = repo.owner.login !== user?.login;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.3), duration: 0.2 }}
      className={cn(
        "group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 px-4 rounded-lg border transition-all cursor-pointer",
        isSelected 
          ? "border-primary/50 bg-primary/5 shadow-[0_0_0_1px_rgba(59,130,246,0.1)]" 
          : "border-border/40 bg-background hover:bg-accent/40 hover:border-border/80"
      )}
      onClick={() => onToggle(repo.id)}
    >
      <div className="flex items-start gap-4 flex-1 w-full overflow-hidden">
        <div className="mt-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={isSelected} onCheckedChange={() => onToggle(repo.id)} />
        </div>
        
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-mono font-medium text-base truncate text-foreground/90 group-hover:text-primary transition-colors">
              {repo.name}
              {isContribution && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  by {repo.owner.login}
                </span>
              )}
            </h3>
            
            {repo.private ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                <Lock className="h-3 w-3" /> Private
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                <Unlock className="h-3 w-3" /> Public
              </span>
            )}

            {repo.archived && (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                <Archive className="h-3 w-3" /> Archived
              </span>
            )}
            
            {repo.fork && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                <GitFork className="h-3 w-3" /> Fork
              </span>
            )}
          </div>
          
          {repo.description && (
            <p className="text-sm text-muted-foreground truncate max-w-2xl">
              {repo.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground sm:ml-auto w-full sm:w-auto pl-8 sm:pl-0 mt-2 sm:mt-0">
        {repo.language && (
          <div className="flex items-center gap-1.5 sm:w-24">
            <span className={cn("h-2 w-2 rounded-full", getLanguageColor(repo.language))} />
            <span className="truncate">{repo.language}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1 sm:w-12">
          <Star className="h-3.5 w-3.5" />
          <span>{repo.stargazers_count}</span>
        </div>
        
        <div className="flex items-center gap-1 sm:w-20">
          <HardDrive className="h-3.5 w-3.5" />
          <span>{formatSize(repo.size)}</span>
        </div>
        
        <div className="flex items-center gap-1 sm:w-24 whitespace-nowrap">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDistanceToNow(repo.updated_at)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const RepoCard: React.FC<RepoItemProps> = ({ repo, isSelected, onToggle, index }) => {
  const { user } = useAuthStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.01, 0.2), duration: 0.2 }}
      className={cn(
        "group relative flex flex-col justify-between gap-4 p-5 rounded-xl border transition-all cursor-pointer h-48",
        isSelected 
          ? "border-primary/50 bg-primary/5 shadow-[0_0_0_1px_rgba(59,130,246,0.1)]" 
          : "border-border/40 bg-background hover:bg-accent/30 hover:border-border/80"
      )}
      onClick={() => onToggle(repo.id)}
    >
      <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected} onCheckedChange={() => onToggle(repo.id)} />
      </div>

      <div className="flex flex-col gap-2 pr-8">
        <h3 className="font-mono font-medium text-base truncate text-foreground/90 group-hover:text-primary transition-colors">
          {repo.name}
          {repo.owner.login !== user?.login && (
            <span className="block text-[10px] font-normal text-muted-foreground mt-0.5">
              by {repo.owner.login}
            </span>
          )}
        </h3>
      </div>
        
        <div className="flex flex-wrap gap-1.5">
          {repo.private ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-border/50 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
              <Lock className="h-2.5 w-2.5" /> Private
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md border border-border/50 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
              <Unlock className="h-2.5 w-2.5" /> Public
            </span>
          )}

          {repo.archived && (
            <span className="inline-flex items-center gap-1 rounded-md bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider">
              <Archive className="h-2.5 w-2.5" /> Archived
            </span>
          )}
          
          {repo.fork && (
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider">
              <GitFork className="h-2.5 w-2.5" /> Fork
            </span>
          )}
        </div>

      {repo.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">
          {repo.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border/40">
        {repo.language ? (
          <div className="flex items-center gap-1.5 truncate pr-2">
            <span className={cn("h-2 w-2 rounded-full shrink-0", getLanguageColor(repo.language))} />
            <span className="truncate">{repo.language}</span>
          </div>
        ) : <div />}
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1" title={`${repo.stargazers_count} stars`}>
            <Star className="h-3.5 w-3.5" />
            <span>{repo.stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1" title={formatDistanceToNow(repo.updated_at)}>
            <Clock className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
