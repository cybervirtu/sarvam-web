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

    const createMockTask = (id: string, content: string): Task => ({
        id,
        content,
        description: '',
        projectId: 'inbox',
        sectionId: null,
        labels: [],
        priority: 4,
        isCompleted: false,
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
            expect(state.tasks[0]).toEqual(task);
        });
    });

    describe('updateTask', () => {
        it('should update an existing task', () => {
            const task = createMockTask('t1', 'Initial Content');
            useTaskStore.getState().addTask(task);

            useTaskStore.getState().updateTask('t1', { content: 'Updated Content' });

            const updatedTask = useTaskStore.getState().tasks[0];
            expect(updatedTask.content).toBe('Updated Content');
            // Ensure other fields remain untouched
            expect(updatedTask.projectId).toBe('inbox');
        });

        it('should not throw if updating a non-existent task', () => {
            expect(() => {
                useTaskStore.getState().updateTask('non-existent', { content: 'New' });
            }).not.toThrow();
        });
    });

    describe('toggleTaskCompletion', () => {
        it('should toggle isCompleted boolean', () => {
            const task = createMockTask('t1', 'Finish tests');
            useTaskStore.getState().addTask(task);

            const storedId = useTaskStore.getState().tasks[0].id;

            // Initially false
            expect(useTaskStore.getState().tasks[0].isCompleted).toBe(false);

            // Toggle to true
            useTaskStore.getState().toggleTaskCompletion(storedId);
            expect(useTaskStore.getState().tasks[0].isCompleted).toBe(true);

            // Toggle back to false
            useTaskStore.getState().toggleTaskCompletion(storedId);
            expect(useTaskStore.getState().tasks[0].isCompleted).toBe(false);
        });
    });

    describe('deleteTask', () => {
        it('should remove the task from the store', () => {
            const task1 = createMockTask('t1', 'Task 1');
            const task2 = createMockTask('t2', 'Task 2');

            useTaskStore.getState().addTask(task1);
            useTaskStore.getState().addTask(task2);

            expect(useTaskStore.getState().tasks).toHaveLength(2);

            useTaskStore.getState().deleteTask('t1');

            const remainingTasks = useTaskStore.getState().tasks;
            expect(remainingTasks).toHaveLength(1);
            expect(remainingTasks[0].id).toBe('t2');
        });
    });
});
