import { create } from 'zustand'

type LibraryStore = {
    selectedItems: string[]
    toggleItem: (id: string) => void
    clearSelection: () => void
}

export const useLibraryStore = create<LibraryStore>((set) => ({
    selectedItems: [],
    toggleItem: (id) => set((state) => ({
        selectedItems: state.selectedItems.includes(id)
            ? state.selectedItems.filter(item => item !== id)
            : [...state.selectedItems, id]
    })),
    clearSelection: () => set({ selectedItems: [] })
}))


type ViewMode = 'grid' | 'list';

type LibraryViewStore = {
    viewMode: ViewMode;
    toggleViewMode: () => void;
    setViewMode: (mode: ViewMode) => void;
}

export const useLibraryViewStore = create<LibraryViewStore>((set) => ({
    viewMode: 'grid',
    toggleViewMode: () => set((state) => ({
        viewMode: state.viewMode === 'grid' ? 'list' : 'grid'
    })),
    setViewMode: (mode) => set({ viewMode: mode })
}))

