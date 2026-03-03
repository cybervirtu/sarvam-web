import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Task, DueDate, Priority } from '../../types';
import { getTasks } from '../../services/mocks';
import { debounce } from '../../utils/debounce';

export type NewTaskPayload = {
    title: string;
    description?: string | null;
    due?: DueDate | null;
    priority?: Priority;
    labels?: string[];
    projectId?: string | null;
    sectionId?: string | null;
    parentId?: string | null;
    order?: number;
};

export type UpdateTaskPayload = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchTasks: () => Promise<void>;
    setTasks: (tasks: Task[]) => void;
    addTask: (task: NewTaskPayload) => void;
    updateTask: (id: string, updates: UpdateTaskPayload) => void;
    toggleTaskCompletion: (id: string) => void;
    deleteTask: (id: string) => void;

    // Selectors
    getInboxTasks: () => Task[];
    getTasksByProject: (projectId: string) => Task[];
    getSubtasks: (parentId: string) => Task[];
}

const debouncedSetItem = debounce((...args: unknown[]) => {
    const [key, value] = args;
    if (typeof key === "string" && typeof value === "string") {
        localStorage.setItem(key, value);
    }
}, 1000);

const debouncedStorage: StateStorage = {
    getItem: (name) => localStorage.getItem(name),
    setItem: (name, value) => debouncedSetItem(name, value),
    removeItem: (name) => localStorage.removeItem(name),
};

export const useTaskStore = create<TaskState>()(
    persist(
        (set, get) => ({
            tasks: [],
            isLoading: false,
            error: null,

            fetchTasks: async () => {
                // If tasks are already hydrated via localStorage persist, do not overwrite with mocks
                if (get().tasks.length > 0) return;

                set({ isLoading: true, error: null });
                try {
                    const tasks = await getTasks();
                    set({ tasks, isLoading: false });
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },

            setTasks: (tasks) => set({ tasks }),

            addTask: (taskData: NewTaskPayload) => set((state) => {
                const newTask: Task = {
                    id: Math.random().toString(36).substring(2, 9),
                    title: taskData.title,
                    description: taskData.description || null,
                    completed: false,
                    priority: taskData.priority || 4,
                    labels: taskData.labels || [],
                    projectId: taskData.projectId || 'inbox',
                    sectionId: taskData.sectionId || null,
                    parentId: taskData.parentId || null,
                    order: taskData.order ?? state.tasks.length + 1,
                    due: taskData.due || null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    completedAt: null
                };
                return { tasks: [newTask, ...state.tasks] };
            }),

            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
                ),
            })),

            toggleTaskCompletion: (id) => set((state) => ({
                tasks: state.tasks.map((task) => {
                    if (task.id === id) {
                        const isNowCompleted = !task.completed;
                        return {
                            ...task,
                            completed: isNowCompleted,
                            completedAt: isNowCompleted ? new Date().toISOString() : null,
                            updatedAt: new Date().toISOString()
                        };
                    }
                    return task;
                }),
            })),

            deleteTask: (id) => set((state) => {
                // Collect all IDs to delete (target task + its subtasks)
                const idsToDelete = new Set<string>([id]);

                // Simple 1-level cascade for now based on requirements
                state.tasks.forEach(task => {
                    if (task.parentId === id) {
                        idsToDelete.add(task.id);
                    }
                });

                return {
                    tasks: state.tasks.filter((task) => !idsToDelete.has(task.id)),
                };
            }),

            // Selectors
            getInboxTasks: () => {
                const { tasks } = get();
                return tasks.filter(task => !task.projectId || task.projectId === 'inbox');
            },

            getTasksByProject: (projectId: string) => {
                const { tasks } = get();
                return tasks.filter(task => task.projectId === projectId);
            },

            getSubtasks: (parentId: string) => {
                const { tasks } = get();
                return tasks.filter(task => task.parentId === parentId);
            }
        }),
        {
            name: 'sarvam-tasks-storage',
            version: 1,
            storage: createJSONStorage(() => debouncedStorage),
            partialize: (state) => ({ tasks: state.tasks }), // Only persist 'tasks' array, ignore isLoading/error flags
        }
    )
);
