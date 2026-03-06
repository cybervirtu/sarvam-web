import { addDays, addWeeks, addMonths } from 'date-fns';
import { Task } from '../types';
import { parseTaskDue } from './dates';

/**
 * Calculates the next occurrence of a task based on its recurrence rule.
 * Supported formats:
 * - "daily"
 * - "weekly"
 * - "monthly"
 * - "every N days"
 * - "every N weeks"
 */
export const computeNextOccurrence = (task: Task): Date | null => {
    if (!task.due || !task.due.isRecurring || !task.due.recurrenceRule) {
        return null;
    }

    const currentDue = parseTaskDue(task);
    if (!currentDue) return null;

    const rule = task.due.recurrenceRule.toLowerCase().trim();

    // 1. Static rules
    if (rule === 'daily') {
        return addDays(currentDue, 1);
    }
    if (rule === 'weekly') {
        return addWeeks(currentDue, 1);
    }
    if (rule === 'monthly') {
        return addMonths(currentDue, 1);
    }

    // 2. Dynamic rules: "every N days/weeks"
    const daysMatch = rule.match(/every (\d+) days/);
    if (daysMatch) {
        const n = parseInt(daysMatch[1], 10);
        return isNaN(n) ? null : addDays(currentDue, n);
    }

    const weeksMatch = rule.match(/every (\d+) weeks/);
    if (weeksMatch) {
        const n = parseInt(weeksMatch[1], 10);
        return isNaN(n) ? null : addWeeks(currentDue, n);
    }

    return null;
};
