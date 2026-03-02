import { Task, Project, Label, Section } from '../../types';

export const MOCK_LABELS: Label[] = [
    {
        id: 'l1',
        name: 'Work',
        color: '#ef4444', // red-500
        order: 1,
        isFavorite: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'l2',
        name: 'Personal',
        color: '#3b82f6', // blue-500
        order: 2,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'l3',
        name: 'Urgent',
        color: '#f59e0b', // amber-500
        order: 3,
        isFavorite: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const MOCK_PROJECTS: Project[] = [
    {
        id: 'p1',
        name: 'Inbox',
        color: '#6b7280', // gray-500
        order: 1,
        isFavorite: false,
        isInbox: true,
        isShared: false,
        viewStyle: 'list',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'p2',
        name: 'Product Launch',
        color: '#8b5cf6', // violet-500
        order: 2,
        isFavorite: true,
        isInbox: false,
        isShared: true,
        viewStyle: 'board',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'p3',
        name: 'Shopping List',
        color: '#10b981', // emerald-500
        order: 3,
        isFavorite: false,
        isInbox: false,
        isShared: false,
        viewStyle: 'list',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const MOCK_SECTIONS: Section[] = [
    {
        id: 's1',
        projectId: 'p2',
        name: 'To Do',
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 's2',
        projectId: 'p2',
        name: 'In Progress',
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const MOCK_TASKS: Task[] = [
    {
        id: 't1',
        projectId: 'p1',
        content: 'Reply to client email',
        description: 'Need to clarify the project scope and timeline.',
        isCompleted: false,
        priority: 1,
        dueDate: {
            date: new Date().toISOString().split('T')[0],
            isRecurring: false,
        },
        labels: ['l1', 'l3'],
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 't2',
        projectId: 'p1',
        content: 'Buy groceries',
        description: 'Milk, Eggs, Bread, Coffee.',
        isCompleted: false,
        priority: 3,
        dueDate: {
            date: new Date().toISOString().split('T')[0],
            isRecurring: false,
        },
        labels: ['l2'],
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 't3',
        projectId: 'p2',
        sectionId: 's1',
        content: 'Finalize UI design system',
        description: 'Review color tokens and typography scale.',
        isCompleted: false,
        priority: 2,
        labels: ['l1'],
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 't4',
        projectId: 'p2',
        sectionId: 's2',
        content: 'Implement mock data layer',
        description: 'Create data.ts and service.ts in src/services/mocks.',
        isCompleted: true,
        priority: 1,
        labels: ['l1'],
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 't5',
        projectId: 'p1',
        content: 'Review quarterly report',
        description: 'Need to finish the financial summary.',
        isCompleted: false,
        priority: 1,
        dueDate: {
            date: '2024-01-01', // Overdue
            isRecurring: false,
        },
        labels: ['l1'],
        order: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
