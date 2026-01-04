import { create } from "zustand";

// Later when expanding:
export const useSearchStore = create((set) => ({
  searchQuery: '',
  isLoading: false,
  isSearchInView: true,
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsSearchInView: (inView) => set({ isSearchInView: inView }),
}));