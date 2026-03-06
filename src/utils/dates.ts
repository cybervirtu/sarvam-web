import {
    parseISO,
    isBefore,
    isAfter,
    startOfDay,
    isSameDay,
    format,
    addDays,
    parse,
} from 'date-fns';
import { Task, DueDate } from '../types';

/**
 * Parses a task's due info into a comparable Date object.
 * For date-only tasks, returns midnight local time.
 */
export const parseTaskDue = (task: Task): Date | null => {
    if (!task.due) return null;

    if (task.due.datetime) {
        return parseISO(task.due.datetime);
    }

    if (task.due.date) {
        // Parse "YYYY-MM-DD" as local midnight
        const [year, month, day] = task.due.date.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    return null;
};

/**
 * Checks if a task is overdue relative to "now".
 * Date-only tasks are overdue only after the day has ended.
 */
export const isOverdue = (task: Task, now: Date = new Date()): boolean => {
    const dueDate = parseTaskDue(task);
    if (!dueDate) return false;

    if (task.due?.datetime) {
        // Precise time check
        return isBefore(dueDate, now);
    }

    // For date-only, it's overdue if "today" is strictly after the due day
    return isBefore(dueDate, startOfDay(now));
};

/**
 * Checks if a task is due today.
 */
export const isDueToday = (task: Task, now: Date = new Date()): boolean => {
    const dueDate = parseTaskDue(task);
    if (!dueDate) return false;

    return isSameDay(dueDate, now);
};

/**
 * Checks if a task is due within a specific range (inclusive).
 */
export const isDueInRange = (
    task: Task,
    start: Date,
    end: Date
): boolean => {
    const dueDate = parseTaskDue(task);
    if (!dueDate) return false;

    // We want inclusive check, and we should consider full days if start/end are day-boundaries
    return !isBefore(dueDate, startOfDay(start)) && !isAfter(dueDate, startOfDay(addDays(end, 1)));
};

/**
 * Groups tasks by due date string in DD-MM-YYYY format.
 */
export const groupTasksByDueDate = (
    tasks: Task[],
    start: Date,
    end: Date
): Record<string, Task[]> => {
    const groups: Record<string, Task[]> = {};

    tasks.forEach((task) => {
        if (!isDueInRange(task, start, end)) return;

        const dueDate = parseTaskDue(task);
        if (!dueDate) return;

        const key = format(dueDate, 'dd-MM-yyyy');
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(task);
    });

    return groups;
};

/**
 * Formats a date for group labels: "Today", "Tomorrow", or "Mon, 11 Mar".
 */
export const formatGroupLabel = (date: Date, now: Date = new Date()): string => {
    if (isSameDay(date, now)) return 'Today';
    if (isSameDay(date, addDays(now, 1))) return 'Tomorrow';
    
    // Check if it's the same year
    const sameYear = date.getFullYear() === now.getFullYear();
    return format(date, sameYear ? 'EEE, d MMM' : 'EEE, d MMM yyyy');
};

/**
 * Stable sorting helper for tasks within a day.
 * 1. Time first (date-only tasks come first as they are "midnight")
 * 2. Priority (1 highest, 4 lowest)
 * 3. Order (ascending)
 */
export const compareTasks = (a: Task, b: Task): number => {
    // 1. Time
    const dateA = parseTaskDue(a);
    const dateB = parseTaskDue(b);

    if (dateA && dateB) {
        const timeA = dateA.getTime();
        const timeB = dateB.getTime();
        if (timeA !== timeB) {
            return timeA - timeB;
        }
    } else if (dateA && !dateB) {
        return 1; // Task with date comes after task without date? 
        // Actually, if we are sorting within a group of "due today", both should have dates.
    } else if (!dateA && dateB) {
        return -1;
    }

    // 2. Priority (1 is higher priority than 2)
    if (a.priority !== b.priority) {
        return a.priority - b.priority;
    }

    // 3. Order
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
};
