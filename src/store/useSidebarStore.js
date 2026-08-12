import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tracks whether the desktop left sidebar is collapsed (icon-only) or
// expanded (icon + label). Persisted so the choice survives a reload,
// but hydration is deferred (skipHydration) so the server-rendered HTML
// and the client's first paint always agree (both start "expanded"),
// avoiding a hydration mismatch. Call `useSidebarStore.persist.rehydrate()`
// once on mount (see LeftSidebar) to pull in the saved value.
export const useSidebarStore = create(
    persist(
        (set) => ({
            collapsed: false,
            toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
            setCollapsed: (collapsed) => set({ collapsed }),
        }),
        {
            name: "musica-sidebar-collapsed",
            skipHydration: true,
        }
    )
);
