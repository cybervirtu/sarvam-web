import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedFilter, FilterCriteria } from '../../types';

interface FilterState {
    filters: SavedFilter[];
    isLoading: boolean;

    // Actions
    addFilter: (name: string, criteria: FilterCriteria[], color?: string) => void;
    updateFilter: (id: string, updates: Partial<Omit<SavedFilter, 'id' | 'createdAt' | 'updatedAt'>>) => void;
    deleteFilter: (id: string) => void;
    getFilterById: (id: string) => SavedFilter | undefined;
}

const DEFAULT_FILTERS: SavedFilter[] = [
    {
        id: 'f-today',
        name: 'Today',
        criteria: [{ kind: 'due', value: 'today' }, { kind: 'completed', value: false }],
        color: 'bg-blue-500',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'f-overdue',
        name: 'Overdue',
        criteria: [{ kind: 'due', value: 'overdue' }, { kind: 'completed', value: false }],
        color: 'bg-orange-500',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'f-p1',
        name: 'Priority 1',
        criteria: [{ kind: 'priority', value: 1 }, { kind: 'completed', value: false }],
        color: 'bg-red-500',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export const useFilterStore = create<FilterState>()(
    persist(
        (set, get) => ({
            filters: DEFAULT_FILTERS,
            isLoading: false,

            addFilter: (name, criteria, color) => set((state) => {
                const newFilter: SavedFilter = {
                    id: `f${Date.now()}`,
                    name,
                    criteria,
                    color: color || 'bg-slate-500',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                return { filters: [...state.filters, newFilter] };
            }),

            updateFilter: (id, updates) => set((state) => ({
                filters: state.filters.map(f =>
                    f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
                )
            })),

            deleteFilter: (id) => set((state) => ({
                filters: state.filters.filter(f => f.id !== id)
            })),

            getFilterById: (id) => get().filters.find(f => f.id === id),
        }),
        {
            name: 'sarvam-filters-storage',
            version: 1,
        }
    )
);
