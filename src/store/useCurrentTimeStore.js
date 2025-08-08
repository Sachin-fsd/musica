import { create } from "zustand";


export const useCurrentTimeStore = create((set) => ({
    currentTime: 0,
    setCurrentTime: (time) => set({ currentTime: time })
}))