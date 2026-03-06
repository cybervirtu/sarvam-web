import { Task } from '../types';
import { isDueToday, isOverdue, isDueInRange, startOfDay, addDays } from './dates';

/**
 * Evaluates whether a task matches a specific filter criterion.
 */
const matchesCriterion = (task: Task, criterion: any): boolean => {
    const { kind, value } = criterion;

    switch (kind) {
        case 'due':
            if (value === 'today') return isDueToday(task);
            if (value === 'overdue') return isOverdue(task);
            if (value === 'next7days') {
                const start = startOfDay(new Date());
                const end = addDays(start, 6);
                return isDueInRange(task, start, end);
            }
            return false;

        case 'priority':
            return task.priority === Number(value);

        case 'label':
            return task.labels.includes(String(value));

        case 'project':
            return task.projectId === String(value);

        case 'completed':
            return task.completed === Boolean(value);

        default:
            return true;
    }
};

/**
 * Filter engine that applies a set of criteria to a list of tasks.
 * Uses logical AND (all criteria must match).
 */
export const evaluateFilter = (tasks: Task[], criteria: any[]): Task[] => {
    if (!criteria || criteria.length === 0) return tasks;

    return tasks.filter(task =>
        criteria.every(criterion => matchesCriterion(task, criterion))
    );
};
