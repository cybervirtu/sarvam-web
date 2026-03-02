import { create } from 'zustand';
import { Project, Label, Section } from '../../types';
import { getProjects, getLabels, getSections } from '../../services/mocks';

interface ProjectState {
    projects: Project[];
    sections: Section[];
    labels: Label[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchProjectsAndLabels: () => Promise<void>;
    fetchSections: (projectId: string) => Promise<void>;
    addProject: (project: Project) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    toggleProjectFavorite: (id: string) => void;
    deleteProject: (id: string) => void;

    addLabel: (label: Label) => void;
    updateLabel: (id: string, updates: Partial<Label>) => void;
    deleteLabel: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
    projects: [],
    sections: [],
    labels: [],
    isLoading: false,
    error: null,

    fetchProjectsAndLabels: async () => {
        set({ isLoading: true, error: null });
        try {
            const [projects, labels] = await Promise.all([
                getProjects(),
                getLabels()
            ]);
            set({ projects, labels, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    fetchSections: async (projectId: string) => {
        set({ isLoading: true, error: null });
        try {
            const sections = await getSections(projectId);
            set({ sections, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
    })),

    updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        )
    })),

    toggleProjectFavorite: (id) => set((state) => ({
        projects: state.projects.map((p) =>
            p.id === id ? { ...p, isFavorite: !p.isFavorite, updatedAt: new Date().toISOString() } : p
        )
    })),

    deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id)
    })),

    addLabel: (label) => set((state) => ({
        labels: [...state.labels, label]
    })),

    updateLabel: (id, updates) => set((state) => ({
        labels: state.labels.map((l) =>
            l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
        )
    })),

    deleteLabel: (id) => set((state) => ({
        labels: state.labels.filter((l) => l.id !== id)
    })),
}));
