import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from './tasks';
import { Task } from '../../types';

describe('Task Store', () => {
    beforeEach(() => {
        // Reset the store before each test
        useTaskStore.setState({
            tasks: [],
            isLoading: false,
            error: null
        });
    });

    const createMockTask = (id: string, title: string): Task => ({
        id,
        title,
        description: '',
        projectId: 'inbox',
        sectionId: null,
        labels: [],
        priority: 4,
        completed: false,
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    describe('addTask', () => {
        it('should add a new task to the store', () => {
            const task = createMockTask('t1', 'Buy groceries');

            useTaskStore.getState().addTask(task);

            const state = useTaskStore.getState();
            expect(state.tasks).toHaveLength(1);
            expect(state.tasks[0].title).toBe(task.title);
            expect(state.tasks[0].completed).toBe(task.completed);
        });
    });

    describe('updateTask', () => {
        it('should update an existing task', () => {
            useTaskStore.getState().addTask({ title: 'Initial Title' });

            const storedId = useTaskStore.getState().tasks[0].id;

            useTaskStore.getState().updateTask(storedId, { title: 'Updated Title' });

            const updatedTask = useTaskStore.getState().tasks.find(t => t.id === storedId)!;
            expect(updatedTask.title).toBe('Updated Title');
            // Ensure other fields remain untouched
            expect(updatedTask.projectId).toBe('inbox');
        });

        it('should not throw if updating a non-existent task', () => {
            expect(() => {
                useTaskStore.getState().updateTask('non-existent', { title: 'New' });
            }).not.toThrow();
        });
    });

    describe('toggleTaskCompletion', () => {
        it('should toggle completed boolean', () => {
            const task = createMockTask('t1', 'Finish tests');
            useTaskStore.getState().addTask(task);

            const storedId = useTaskStore.getState().tasks[0].id;

            // Initially false
            expect(useTaskStore.getState().tasks[0].completed).toBe(false);

            // Toggle to true
            useTaskStore.getState().toggleTaskCompletion(storedId);
            expect(useTaskStore.getState().tasks[0].completed).toBe(true);

            // Toggle back to false
            useTaskStore.getState().toggleTaskCompletion(storedId);
            expect(useTaskStore.getState().tasks[0].completed).toBe(false);
        });
    });

    describe('deleteTask', () => {
        it('should remove the task from the store', () => {
            useTaskStore.getState().addTask({ title: 'Task 1' });
            useTaskStore.getState().addTask({ title: 'Task 2' });

            const state = useTaskStore.getState();
            expect(state.tasks).toHaveLength(2);

            const task1Id = state.tasks.find(t => t.title === 'Task 1')!.id;
            const task2Id = state.tasks.find(t => t.title === 'Task 2')!.id;

            useTaskStore.getState().deleteTask(task1Id);

            const remainingTasks = useTaskStore.getState().tasks;
            expect(remainingTasks).toHaveLength(1);
            expect(remainingTasks[0].id).toBe(task2Id);
        });
    });

    describe('Selectors', () => {
        it('getInboxTasks should return tasks with projectId "inbox" or null/undefined', () => {
            const task1 = createMockTask('t1', 'Inbox 1');
            task1.projectId = 'inbox';

            const task2 = createMockTask('t2', 'No Project');
            task2.projectId = null;

            const task3 = createMockTask('t3', 'Project 1');
            task3.projectId = 'p1';

            useTaskStore.getState().setTasks([task1, task2, task3]);

            const inboxTasks = useTaskStore.getState().getInboxTasks();
            expect(inboxTasks).toHaveLength(2);
            expect(inboxTasks.map(t => t.id)).toEqual(expect.arrayContaining(['t1', 't2']));
        });

        it('getTasksByProject should return tasks for a specific project', () => {
            const task1 = createMockTask('t1', 'Inbox 1');
            task1.projectId = 'inbox';

            const task2 = createMockTask('t2', 'Project 1 Task A');
            task2.projectId = 'p1';

            const task3 = createMockTask('t3', 'Project 1 Task B');
            task3.projectId = 'p1';

            useTaskStore.getState().setTasks([task1, task2, task3]);

            const p1Tasks = useTaskStore.getState().getTasksByProject('p1');
            expect(p1Tasks).toHaveLength(2);
            expect(p1Tasks.map(t => t.id)).toEqual(expect.arrayContaining(['t2', 't3']));
        });

        it('getSubtasks should return tasks with a specific parentId', () => {
            const parentTask = createMockTask('p1', 'Parent Task');

            const sub1 = createMockTask('s1', 'Subtask 1');
            sub1.parentId = 'p1';

            const sub2 = createMockTask('s2', 'Subtask 2');
            sub2.parentId = 'p1';

            const otherTask = createMockTask('o1', 'Other Task');

            useTaskStore.getState().setTasks([parentTask, sub1, sub2, otherTask]);

            const subtasks = useTaskStore.getState().getSubtasks('p1');
            expect(subtasks).toHaveLength(2);
            expect(subtasks.map(t => t.id)).toEqual(expect.arrayContaining(['s1', 's2']));
        });
    });
});
