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
    reorderTasksWithinSection: (projectId: string | null, sectionId: string | null, newOrderedTaskIds: string[]) => void;
    moveTasksToInbox: (projectId: string, inboxId: string) => void;
    clearTasksSection: (sectionId: string) => void;

    // Selectors
    getInboxTasks: () => Task[];
    getTasksByProject: (projectId: string) => Task[];
    getTasksBySection: (projectId: string, sectionId: string) => Task[];
    getUnsectionedTasks: (projectId: string) => Task[];
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

            addTask: (taskData) => set((state) => {
                const id = `t${Date.now()}`;
                const now = new Date().toISOString();

                // Calculate next order value within the same section/project
                const sameContextTasks = state.tasks.filter(t =>
                    t.projectId === (taskData.projectId || 'p1') &&
                    t.sectionId === (taskData.sectionId || null)
                );
                const maxOrder = sameContextTasks.reduce((max, t) => Math.max(max, t.order || 0), 0);

                const newTask: Task = {
                    id,
                    title: taskData.title,
                    description: taskData.description,
                    priority: taskData.priority || 4,
                    completed: false,
                    projectId: taskData.projectId || 'p1',
                    sectionId: taskData.sectionId || null,
                    parentId: null,
                    labels: taskData.labels || [],
                    due: taskData.due || null,
                    order: maxOrder + 1,
                    createdAt: now,
                    updatedAt: now,
                    completedAt: null
                };
                return { tasks: [...state.tasks, newTask] };
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

            reorderTasksWithinSection: (projectId, sectionId, newOrderedTaskIds) => set((state) => {
                const orderMap = new Map<string, number>();
                newOrderedTaskIds.forEach((id, index) => {
                    orderMap.set(id, index + 1);
                });

                const updatedTasks = state.tasks.map(task => {
                    if (task.projectId === projectId && task.sectionId === sectionId && orderMap.has(task.id)) {
                        return {
                            ...task,
                            order: orderMap.get(task.id)!,
                            updatedAt: new Date().toISOString()
                        };
                    }
                    return task;
                });

                return { tasks: updatedTasks };
            }),

            moveTasksToInbox: (projectId: string, inboxId: string) => set((state) => {
                return {
                    tasks: state.tasks.map((task) =>
                        task.projectId === projectId ? { ...task, projectId: inboxId, sectionId: null, updatedAt: new Date().toISOString() } : task
                    ),
                };
            }),

            clearTasksSection: (sectionId: string) => set((state) => {
                return {
                    tasks: state.tasks.map((task) =>
                        task.sectionId === sectionId ? { ...task, sectionId: null, updatedAt: new Date().toISOString() } : task
                    ),
                };
            }),

            // Selectors
            getInboxTasks: () => {
                const { tasks } = get();
                return tasks
                    .filter(task => task.projectId === 'p1')
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
            },

            getTasksByProject: (projectId: string) => {
                const { tasks } = get();
                return tasks
                    .filter(task => task.projectId === projectId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
            },

            getTasksBySection: (projectId: string, sectionId: string) => {
                const { tasks } = get();
                return tasks
                    .filter(task => task.projectId === projectId && task.sectionId === sectionId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
            },

            getUnsectionedTasks: (projectId: string) => {
                const { tasks } = get();
                return tasks
                    .filter(task => task.projectId === projectId && !task.sectionId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
            },

            getSubtasks: (parentId: string) => {
                const { tasks } = get();
                return tasks
                    .filter(task => task.parentId === parentId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
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
