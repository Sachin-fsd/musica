import { create } from "zustand";

// Later when expanding:
export const useSearchStore = create((set) => ({
  searchQuery: '',
  isLoading: false,
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));