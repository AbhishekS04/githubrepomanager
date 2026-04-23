import React from 'react';
import { RepoRow, RepoCard } from './RepoRow';
import type { Repo } from '../../lib/github';
import { useSelectionStore } from '../../store/selectionStore';
import { CheckSquare } from 'lucide-react';
import { Button } from '../ui/Button';

interface RepoListProps {
  repos: Repo[];
  isLoading: boolean;
}

export const RepoList: React.FC<RepoListProps> = ({ repos, isLoading }) => {
  const { selectedIds, toggleSelection, selectAll, deselectAll, viewMode } = useSelectionStore();

  const handleSelectAll = () => {
    if (selectedIds.size === repos.length && repos.length > 0) {
      deselectAll();
    } else {
      selectAll(repos.map(r => r.id));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 w-full rounded-lg border border-border/40 bg-accent/20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border/60 rounded-xl bg-accent/5">
        <div className="bg-background p-4 rounded-full border border-border mb-4">
          <CheckSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground">No repositories found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          Try adjusting your search query or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSelectAll}
          className="text-xs -ml-2 text-muted-foreground"
        >
          {selectedIds.size === repos.length ? 'Deselect All' : 'Select All'}
        </Button>
        <span className="text-xs text-muted-foreground">
          Showing {repos.length} repositories
        </span>
      </div>

      {viewMode === 'list' ? (
        <div className="flex flex-col gap-2">
          {repos.map((repo, index) => (
            <RepoRow 
              key={repo.id} 
              repo={repo} 
              isSelected={selectedIds.has(repo.id)} 
              onToggle={toggleSelection}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {repos.map((repo, index) => (
            <RepoCard 
              key={repo.id} 
              repo={repo} 
              isSelected={selectedIds.has(repo.id)} 
              onToggle={toggleSelection}
              index={index}
            />
          ))}
        </div>
      )}
      
      {/* Spacer for bottom action bar */}
      <div className="h-24" />
    </div>
  );
};
