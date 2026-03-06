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
    createSubtask: (parentId: string, title: string) => void;
    updateTask: (id: string, updates: UpdateTaskPayload) => void;
    toggleTaskCompletion: (id: string) => void;
    deleteTask: (id: string) => void;
    reorderTasksWithinSection: (projectId: string | null, sectionId: string | null, newOrderedTaskIds: string[]) => void;
    moveTaskToSection: (taskId: string, projectId: string | null, toSectionId: string | null, toIndex: number) => void;
    moveTasksToInbox: (projectId: string, inboxId: string) => void;
    clearTasksSection: (sectionId: string) => void;
    moveSubtaskToParent: (subtaskId: string, newParentId: string, toIndex: number) => void;
    setTaskParent: (taskId: string, parentId: string | null) => void;

    // Selectors
    getInboxTasks: () => Task[];
    getTasksByProject: (projectId: string) => Task[];
    getTasksBySection: (projectId: string, sectionId: string) => Task[];
    getUnsectionedTasks: (projectId: string) => Task[];
    getSubtasks: (parentId: string) => Task[];
    getEligibleParents: (projectId: string, excludeTaskId: string) => Task[];
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

let taskCounter = 0;

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
                const id = `t${Date.now()}-${taskCounter++}`;
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

            createSubtask: (parentId, title) => set((state) => {
                const parentTask = state.tasks.find(t => t.id === parentId);
                if (!parentTask) return state;

                const id = `t${Date.now()}-${taskCounter++}`;
                const now = new Date().toISOString();

                // Calculate next order value among subtasks
                const subtasks = state.tasks.filter(t => t.parentId === parentId);
                const maxOrder = subtasks.reduce((max, t) => Math.max(max, t.order || 0), 0);

                const newTask: Task = {
                    id,
                    title,
                    priority: 4,
                    completed: false,
                    projectId: parentTask.projectId,
                    sectionId: parentTask.sectionId,
                    parentId,
                    labels: [],
                    due: null,
                    order: maxOrder + 1,
                    createdAt: now,
                    updatedAt: now,
                    completedAt: null
                };
                return { tasks: [...state.tasks, newTask] };
            }),

            updateTask: (id, updates) => set((state) => {
                const currentTask = state.tasks.find(t => t.id === id);
                if (!currentTask) return state;

                let updatedTasks = state.tasks.map((task) =>
                    task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
                );

                const projectChanged = updates.projectId !== undefined && updates.projectId !== currentTask.projectId;
                const sectionChanged = updates.sectionId !== undefined && updates.sectionId !== currentTask.sectionId;

                // Cascade project/section changes to subtasks
                if (projectChanged || sectionChanged) {
                    updatedTasks = updatedTasks.map((task) => {
                        if (task.parentId === id) {
                            return {
                                ...task,
                                projectId: updates.projectId !== undefined ? updates.projectId : task.projectId,
                                sectionId: updates.sectionId !== undefined ? (updates.sectionId as string | null) : task.sectionId,
                                updatedAt: new Date().toISOString()
                            };
                        }
                        return task;
                    });
                }

                return { tasks: updatedTasks };
            }),

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

            moveTaskToSection: (taskId, projectId, toSectionId, toIndex) => set((state) => {
                const taskToMove = state.tasks.find(t => t.id === taskId);
                if (!taskToMove) return state;

                // 1. Update the task's section and project
                const updatedTask = {
                    ...taskToMove,
                    projectId: projectId || taskToMove.projectId,
                    sectionId: toSectionId,
                    updatedAt: new Date().toISOString()
                };

                // 2. Get all other tasks in the target section
                const otherTasksInTarget = state.tasks
                    .filter(t => t.id !== taskId && t.projectId === (projectId || taskToMove.projectId) && t.sectionId === toSectionId && !t.parentId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));

                // 3. Insert the task at the specified index
                const newTargetList = [...otherTasksInTarget];
                newTargetList.splice(toIndex, 0, updatedTask);

                // 4. Update orders for all tasks in target section
                const targetOrders = new Map<string, number>();
                newTargetList.forEach((t, i) => targetOrders.set(t.id, i + 1));

                // 5. Update orders for source section tasks (to fill gaps)
                const sourceTasks = state.tasks
                    .filter(t => t.id !== taskId && t.projectId === taskToMove.projectId && t.sectionId === taskToMove.sectionId && !t.parentId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));

                const sourceOrders = new Map<string, number>();
                sourceTasks.forEach((t, i) => sourceOrders.set(t.id, i + 1));

                return {
                    tasks: state.tasks.map(t => {
                        if (t.id === taskId) return updatedTask;
                        if (targetOrders.has(t.id)) return { ...t, order: targetOrders.get(t.id)!, updatedAt: new Date().toISOString() };
                        if (sourceOrders.has(t.id)) return { ...t, order: sourceOrders.get(t.id)!, updatedAt: new Date().toISOString() };
                        return t;
                    })
                };
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

            moveSubtaskToParent: (subtaskId, newParentId, toIndex) => set((state) => {
                const taskToMove = state.tasks.find(t => t.id === subtaskId);
                const newParent = state.tasks.find(t => t.id === newParentId);
                if (!taskToMove || !newParent) return state;

                const oldParentId = taskToMove.parentId;

                // 1. Update the task's parent, project, and section
                const updatedTask: Task = {
                    ...taskToMove,
                    parentId: newParentId,
                    projectId: newParent.projectId,
                    sectionId: newParent.sectionId,
                    updatedAt: new Date().toISOString()
                };

                // 2. Update orders for tasks under new parent
                const subtasksInTarget = state.tasks
                    .filter(t => t.id !== subtaskId && t.parentId === newParentId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));

                const newTargetList = [...subtasksInTarget];
                newTargetList.splice(toIndex, 0, updatedTask);

                const targetOrders = new Map<string, number>();
                newTargetList.forEach((t, i) => targetOrders.set(t.id, i + 1));

                // 3. Update orders for tasks under old parent (if any)
                const sourceOrders = new Map<string, number>();
                if (oldParentId) {
                    const subtasksInSource = state.tasks
                        .filter(t => t.id !== subtaskId && t.parentId === oldParentId)
                        .sort((a, b) => (a.order || 0) - (b.order || 0));
                    subtasksInSource.forEach((t, i) => sourceOrders.set(t.id, i + 1));
                }

                return {
                    tasks: state.tasks.map(t => {
                        if (t.id === subtaskId) return updatedTask;
                        if (targetOrders.has(t.id)) return { ...t, order: targetOrders.get(t.id)!, updatedAt: new Date().toISOString() };
                        if (sourceOrders.has(t.id)) return { ...t, order: sourceOrders.get(t.id)!, updatedAt: new Date().toISOString() };
                        return t;
                    })
                };
            }),

            setTaskParent: (taskId, parentId) => set((state) => {
                const task = state.tasks.find(t => t.id === taskId);
                if (!task) return state;

                let projectId = task.projectId;
                let sectionId = task.sectionId;

                if (parentId) {
                    const parent = state.tasks.find(t => t.id === parentId);
                    if (parent) {
                        projectId = parent.projectId;
                        sectionId = parent.sectionId;
                    }
                }

                // Calculate next order in the new context
                const siblings = state.tasks.filter(t =>
                    t.id !== taskId &&
                    t.parentId === parentId &&
                    t.projectId === projectId &&
                    t.sectionId === sectionId
                );
                const maxOrder = siblings.reduce((max, t) => Math.max(max, t.order || 0), 0);

                return {
                    tasks: state.tasks.map(t =>
                        t.id === taskId ? {
                            ...t,
                            parentId,
                            projectId,
                            sectionId,
                            order: maxOrder + 1,
                            updatedAt: new Date().toISOString()
                        } : t
                    )
                };
            }),

            // Selectors
            getInboxTasks: () => {
                const { tasks } = get();
                return tasks
                    .filter(task => task.projectId === 'p1' && !task.parentId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
            },

            getTasksByProject: (projectId: string) => {
                const { tasks } = get();
                return tasks
                    .filter(task => task.projectId === projectId && !task.parentId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
            },

            getTasksBySection: (projectId: string, sectionId: string) => {
                const { tasks } = get();
                return tasks
                    .filter(task => task.projectId === projectId && task.sectionId === sectionId && !task.parentId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
            },

            getUnsectionedTasks: (projectId: string) => {
                const { tasks } = get();
                return tasks
                    .filter(task => task.projectId === projectId && !task.sectionId && !task.parentId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
            },

            getSubtasks: (parentId: string) => {
                const { tasks } = get();
                return tasks
                    .filter(task => task.parentId === parentId)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
            },

            getEligibleParents: (projectId: string, excludeTaskId: string) => {
                const { tasks } = get();
                return tasks
                    .filter(task =>
                        task.projectId === projectId &&
                        !task.parentId &&
                        task.id !== excludeTaskId
                    )
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
