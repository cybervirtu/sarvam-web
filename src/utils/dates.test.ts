import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
    parseTaskDue,
    isOverdue,
    isDueToday,
    isDueInRange,
    groupTasksByDueDate,
    formatGroupLabel,
    compareTasks
} from './dates';
import { Task, Priority } from '../types';

describe('Date Utilities (Sprint 4)', () => {
    const mockNow = new Date('2026-03-06T12:00:00'); // Local time Friday

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(mockNow);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const createTask = (due: any, priority: Priority = 4, order: number = 0): Task => ({
        id: '1',
        title: 'Test Task',
        completed: false,
        priority,
        due,
        order,
        labels: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    describe('parseTaskDue', () => {
        it('should return null if no due date', () => {
            expect(parseTaskDue(createTask(null))).toBeNull();
        });

        it('should parse date-only as local midnight', () => {
            const task = createTask({ date: '2026-03-06', isRecurring: false });
            const parsed = parseTaskDue(task);
            expect(parsed?.getFullYear()).toBe(2026);
            expect(parsed?.getMonth()).toBe(2); // March is 2
            expect(parsed?.getDate()).toBe(6);
            expect(parsed?.getHours()).toBe(0);
        });

        it('should parse datetime correctly', () => {
            const task = createTask({ datetime: '2026-03-06T15:30:00Z', isRecurring: false });
            const parsed = parseTaskDue(task);
            expect(parsed?.toISOString()).toBe('2026-03-06T15:30:00.000Z');
        });
    });

    describe('isOverdue', () => {
        it('should return true if datetime is in the past', () => {
            const task = createTask({ datetime: '2026-03-06T10:00:00', isRecurring: false });
            // now is 12:00
            expect(isOverdue(task, mockNow)).toBe(true);
        });

        it('should return false if datetime is in the future', () => {
            const task = createTask({ datetime: '2026-03-06T14:00:00', isRecurring: false });
            expect(isOverdue(task, mockNow)).toBe(false);
        });

        it('should return false for date-only task due today', () => {
            const task = createTask({ date: '2026-03-06', isRecurring: false });
            expect(isOverdue(task, mockNow)).toBe(false);
        });

        it('should return true for date-only task due yesterday', () => {
            const task = createTask({ date: '2026-03-05', isRecurring: false });
            expect(isOverdue(task, mockNow)).toBe(true);
        });
    });

    describe('isDueToday', () => {
        it('should return true for tasks due on the same day', () => {
            const dateTask = createTask({ date: '2026-03-06', isRecurring: false });
            const timeTask = createTask({ datetime: '2026-03-06T20:00:00', isRecurring: false });
            expect(isDueToday(dateTask, mockNow)).toBe(true);
            expect(isDueToday(timeTask, mockNow)).toBe(true);
        });

        it('should return false for tasks due tomorrow', () => {
            const task = createTask({ date: '2026-03-07', isRecurring: false });
            expect(isDueToday(task, mockNow)).toBe(false);
        });
    });

    describe('groupTasksByDueDate', () => {
        it('should group tasks by DD-MM-YYYY', () => {
            const t1 = createTask({ date: '2026-03-06', isRecurring: false });
            const t2 = createTask({ date: '2026-03-06', isRecurring: false });
            const t3 = createTask({ date: '2026-03-07', isRecurring: false });

            const start = new Date('2026-03-06');
            const end = new Date('2026-03-07');

            const grouped = groupTasksByDueDate([t1, t2, t3], start, end);
            expect(grouped['06-03-2026']).toHaveLength(2);
            expect(grouped['07-03-2026']).toHaveLength(1);
        });
    });

    describe('formatGroupLabel', () => {
        it('should return Today and Tomorrow correctly', () => {
            expect(formatGroupLabel(new Date('2026-03-06'), mockNow)).toBe('Today');
            expect(formatGroupLabel(new Date('2026-03-07'), mockNow)).toBe('Tomorrow');
        });

        it('should return formatted date for others', () => {
            expect(formatGroupLabel(new Date('2026-03-10'), mockNow)).toBe('Tue, 10 Mar');
        });

        it('should include year for different years', () => {
            expect(formatGroupLabel(new Date('2027-03-10'), mockNow)).toBe('Wed, 10 Mar 2027');
        });
    });

    describe('compareTasks', () => {
        it('should sort by time (date-only first)', () => {
            const t1 = createTask({ datetime: '2026-03-06T15:00:00', isRecurring: false });
            const t2 = createTask({ date: '2026-03-06', isRecurring: false });
            const t3 = createTask({ datetime: '2026-03-06T10:00:00', isRecurring: false });

            const sorted = [t1, t2, t3].sort(compareTasks);
            expect(sorted[0]).toBe(t2); // Midnight
            expect(sorted[1]).toBe(t3); // 10:00
            expect(sorted[2]).toBe(t1); // 15:00
        });

        it('should sort by priority if times are same', () => {
            const t1 = createTask({ date: '2026-03-06', isRecurring: false }, 4);
            const t2 = createTask({ date: '2026-03-06', isRecurring: false }, 1);

            const sorted = [t1, t2].sort(compareTasks);
            expect(sorted[0]).toBe(t2);
        });

        it('should sort by order if times and priority are same', () => {
            const t1 = createTask({ date: '2026-03-06', isRecurring: false }, 1, 10);
            const t2 = createTask({ date: '2026-03-06', isRecurring: false }, 1, 5);

            const sorted = [t1, t2].sort(compareTasks);
            expect(sorted[0]).toBe(t2);
        });
    });
});
