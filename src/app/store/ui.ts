import { create } from 'zustand';

interface UIState {
    isSidebarOpen: boolean;
    activeTaskId: string | null;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
    openTaskDrawer: (taskId: string) => void;
    closeTaskDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true,
    activeTaskId: null,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    openTaskDrawer: (taskId) => set({ activeTaskId: taskId }),
    closeTaskDrawer: () => set({ activeTaskId: null }),
}));
