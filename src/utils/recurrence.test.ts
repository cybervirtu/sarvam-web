import { describe, it, expect } from 'vitest';
import { computeNextOccurrence } from './recurrence';
import { Task } from '../types';

describe('computeNextOccurrence', () => {
    const baseDate = '2026-03-01'; // Sunday
    const createTask = (rule: string, date: string = baseDate): Task => ({
        id: 't1',
        title: 'Test Task',
        completed: false,
        priority: 4,
        labels: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        due: {
            date,
            isRecurring: true,
            recurrenceRule: rule
        }
    } as Task);

    it('should return null if not recurring', () => {
        const task = createTask('daily');
        if (task.due) task.due.isRecurring = false;
        expect(computeNextOccurrence(task)).toBeNull();
    });

    it('should return null if due date object is missing', () => {
        const task = createTask('daily');
        task.due = undefined as any;
        expect(computeNextOccurrence(task)).toBeNull();
    });

    it('should calculate daily recurrence', () => {
        const task = createTask('daily');
        const next = computeNextOccurrence(task);
        expect(next?.toISOString().split('T')[0]).toBe('2026-03-02');
    });

    it('should calculate weekly recurrence', () => {
        const task = createTask('weekly');
        const next = computeNextOccurrence(task);
        expect(next?.toISOString().split('T')[0]).toBe('2026-03-08');
    });

    it('should calculate monthly recurrence', () => {
        const task = createTask('monthly');
        const next = computeNextOccurrence(task);
        expect(next?.toISOString().split('T')[0]).toBe('2026-04-01');
    });

    it('should calculate "every N days" (N=2, N=5)', () => {
        const task2 = createTask('every 2 days');
        expect(computeNextOccurrence(task2)?.toISOString().split('T')[0]).toBe('2026-03-03');

        const task5 = createTask('every 5 days');
        expect(computeNextOccurrence(task5)?.toISOString().split('T')[0]).toBe('2026-03-06');
    });

    it('should calculate "every N weeks"', () => {
        const task = createTask('every 2 weeks');
        const next = computeNextOccurrence(task);
        expect(next?.toISOString().split('T')[0]).toBe('2026-03-15');
    });

    it('should handle case-insensitivity', () => {
        const task = createTask('DAILY');
        const next = computeNextOccurrence(task);
        expect(next?.toISOString().split('T')[0]).toBe('2026-03-02');
    });

    it('should handle trim', () => {
        const task = createTask(' weekly ');
        const next = computeNextOccurrence(task);
        expect(next?.toISOString().split('T')[0]).toBe('2026-03-08');
    });

    it('should return null for invalid rules', () => {
        const task = createTask('invalid rule');
        expect(computeNextOccurrence(task)).toBeNull();
    });

    it('should preserve time in datetime if present', () => {
        const task = createTask('daily');
        const datetime = '2026-03-01T15:30:00Z';
        if (task.due) {
            task.due.datetime = datetime;
        }
        const next = computeNextOccurrence(task);
        expect(next?.toISOString()).toBe('2026-03-02T15:30:00.000Z');
    });
});
