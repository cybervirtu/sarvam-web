import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isToday, isOverdue, formatDisplayDate, getNext7Days } from './date';

describe('Date Utilities', () => {
    beforeEach(() => {
        // Mock system time to ensure tests don't fail based on execution time
        vi.useFakeTimers();
        const mockDate = new Date('2024-03-15T10:00:00Z');
        vi.setSystemTime(mockDate);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('isToday', () => {
        it('should return true for today\'s date', () => {
            const today = new Date('2024-03-15T14:30:00Z').toISOString();
            expect(isToday(today)).toBe(true);
        });

        it('should return false for tomorrow\'s date', () => {
            const tomorrow = new Date('2024-03-16T10:00:00Z').toISOString();
            expect(isToday(tomorrow)).toBe(false);
        });

        it('should return false for yesterday\'s date', () => {
            const yesterday = new Date('2024-03-14T10:00:00Z').toISOString();
            expect(isToday(yesterday)).toBe(false);
        });
    });

    describe('isOverdue', () => {
        it('should return true for a past date', () => {
            const pastDate = new Date('2024-03-14T23:59:59Z').toISOString();
            expect(isOverdue(pastDate)).toBe(true);
        });

        it('should return false for today\'s date', () => {
            const today = new Date('2024-03-15T10:00:00Z').toISOString();
            expect(isOverdue(today)).toBe(false);
        });

        it('should return false for a future date', () => {
            const futureDate = new Date('2024-03-16T10:00:00Z').toISOString();
            expect(isOverdue(futureDate)).toBe(false);
        });
    });

    describe('formatDisplayDate', () => {
        it('should format today correctly', () => {
            const today = new Date('2024-03-15T10:00:00Z').toISOString();
            expect(formatDisplayDate(today)).toBe('Today');
        });

        it('should format tomorrow correctly', () => {
            const tomorrow = new Date('2024-03-16T10:00:00Z').toISOString();
            expect(formatDisplayDate(tomorrow)).toBe('Tomorrow');
        });

        it('should format yesterday correctly', () => {
            const yesterday = new Date('2024-03-14T10:00:00Z').toISOString();
            expect(formatDisplayDate(yesterday)).toBe('Yesterday');
        });

        it('should format dates further in the future as short MMM D', () => {
            const future = new Date('2024-03-20T10:00:00Z').toISOString();
            expect(formatDisplayDate(future)).toBe('Mar 20');
        });
    });

    describe('getNext7Days', () => {
        it('should return an array of 7 ISO string dates starting today', () => {
            const days = getNext7Days();
            expect(days).toHaveLength(7);

            // Check first date is today
            const firstDate = new Date(days[0]);
            expect(firstDate.getUTCFullYear()).toBe(2024);
            expect(firstDate.getUTCMonth()).toBe(2); // 0-indexed March
            expect(firstDate.getUTCDate()).toBe(15);

            // Check last date is 6 days from today
            const lastDate = new Date(days[6]);
            expect(lastDate.getUTCDate()).toBe(21);
        });
    });
});
