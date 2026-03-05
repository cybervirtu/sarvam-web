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
    addProject: (name: string, color?: string) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    toggleProjectFavorite: (id: string) => void;
    deleteProject: (id: string) => void;
    setProjects: (projects: Project[]) => void;

    addLabel: (label: Label) => void;
    updateLabel: (id: string, updates: Partial<Label>) => void;
    deleteLabel: (id: string) => void;
    // Section Actions
    addSection: (projectId: string, name: string) => void;
    updateSection: (sectionId: string, updates: Partial<Section>) => void;
    deleteSection: (sectionId: string) => void;

    // Selectors
    getInboxProjectId: () => string | undefined;
    getSectionsByProject: (projectId: string) => Section[];
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

    addProject: (name, color = '#808080') => set((state) => {
        const newProject: Project = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            color,
            order: state.projects.length + 1,
            isFavorite: false,
            isInbox: false,
            isShared: false,
            viewStyle: 'list',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return { projects: [...state.projects, newProject] };
    }),

    deleteProject: (id) => {
        set((state) => ({
            projects: state.projects.filter((p) => p.id !== id)
        }));
    },

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

    setProjects: (projects: Project[]) => set({ projects }),

    // Section Actions
    addSection: (projectId, name) => set((state) => {
        const projectSections = state.sections.filter(s => s.projectId === projectId);
        const newSection: Section = {
            id: Math.random().toString(36).substring(2, 9),
            projectId,
            name,
            order: projectSections.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return { sections: [...state.sections, newSection] };
    }),

    updateSection: (sectionId, updates) => set((state) => ({
        sections: state.sections.map(s =>
            s.id === sectionId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
        )
    })),

    deleteSection: (sectionId) => set((state) => ({
        sections: state.sections.filter(s => s.id !== sectionId)
    })),

    getInboxProjectId: (): string | undefined => {
        const state = useProjectStore.getState();
        return state.projects.find((p: Project) => p.isInbox)?.id;
    },

    getSectionsByProject: (projectId: string): Section[] => {
        const state = useProjectStore.getState();
        return state.sections.filter((s: Section) => s.projectId === projectId).sort((a: Section, b: Section) => a.order - b.order);
    },
}));
