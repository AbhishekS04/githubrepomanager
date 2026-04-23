import React from 'react';
import { useSelectionStore } from '../../store/selectionStore';
import type { FilterVisibility, SortOption } from '../../store/selectionStore';
import { Search, LayoutGrid, List } from 'lucide-react';
import { cn } from '../../lib/utils';

export const FilterBar: React.FC<{ totalCount: number }> = ({ totalCount }) => {
  const { 
    searchQuery, setSearchQuery, 
    visibilityFilter, setVisibilityFilter,
    sortBy, setSortBy,
    viewMode, setViewMode
  } = useSelectionStore();

  const filters: { value: FilterVisibility; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'archived', label: 'Archived' },
    { value: 'forks', label: 'Forks' },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Repositories <span className="text-muted-foreground text-lg font-normal ml-2">{totalCount} total</span>
        </h1>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search repositories..."
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center border border-input rounded-md bg-background overflow-hidden h-9">
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors", viewMode === 'list' && "bg-accent text-foreground")}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <div className="w-px h-full bg-border" />
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors", viewMode === 'grid' && "bg-accent text-foreground")}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setVisibilityFilter(f.value)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full transition-colors border",
                visibilityFilter === f.value 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="updated">Last Updated</option>
            <option value="name">Name (A-Z)</option>
            <option value="stars">Stars</option>
            <option value="size">Size</option>
          </select>
        </div>
      </div>
    </div>
  );
};
