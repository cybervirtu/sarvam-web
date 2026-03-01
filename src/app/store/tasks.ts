import { create } from 'zustand';
import { Task } from '../../types';
import { getTasks } from '../../services/mocks';

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchTasks: () => Promise<void>;
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    toggleTaskCompletion: (id: string) => void;
    deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],
    isLoading: false,
    error: null,

    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const tasks = await getTasks();
            set({ tasks, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    setTasks: (tasks) => set({ tasks }),

    addTask: (task) => set((state) => ({
        tasks: [task, ...state.tasks]
    })),

    updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
        ),
    })),

    toggleTaskCompletion: (id) => set((state) => ({
        tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date().toISOString() } : task
        ),
    })),

    deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
    })),
}));
