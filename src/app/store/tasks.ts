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
    addTask: (task: Partial<Task>) => void;
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

    addTask: (taskData: Partial<Task>) => set((state) => {
        const newTask: Task = {
            id: Math.random().toString(36).substring(2, 9),
            content: taskData.content || 'Untitled Task',
            description: taskData.description || '',
            isCompleted: false,
            priority: taskData.priority || 4,
            labels: taskData.labels || [],
            projectId: taskData.projectId || 'inbox',
            sectionId: taskData.sectionId,
            order: state.tasks.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...taskData
        };
        return { tasks: [newTask, ...state.tasks] };
    }),

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
