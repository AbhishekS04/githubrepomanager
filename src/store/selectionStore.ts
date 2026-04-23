import { create } from 'zustand';

export type FilterVisibility = 'all' | 'public' | 'private' | 'archived' | 'forks';
export type SortOption = 'updated' | 'name' | 'stars' | 'size';

interface SelectionState {
  selectedIds: Set<number>;
  searchQuery: string;
  visibilityFilter: FilterVisibility;
  sortBy: SortOption;
  viewMode: 'list' | 'grid';
  
  toggleSelection: (id: number) => void;
  selectAll: (ids: number[]) => void;
  deselectAll: () => void;
  
  setSearchQuery: (query: string) => void;
  setVisibilityFilter: (filter: FilterVisibility) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: 'list' | 'grid') => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedIds: new Set(),
  searchQuery: '',
  visibilityFilter: 'all',
  sortBy: 'updated',
  viewMode: 'list',

  toggleSelection: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { selectedIds: newSet };
    }),
  
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  
  deselectAll: () => set({ selectedIds: new Set() }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setVisibilityFilter: (visibilityFilter) => set({ visibilityFilter, selectedIds: new Set() }),
  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),
}));
