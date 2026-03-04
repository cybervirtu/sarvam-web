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

// Helper functions for dates (assuming these are defined elsewhere or will be added)
const getTodayDateString = () => new Date().toISOString().split('T')[0];
const dateAhead = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

export const MOCK_TASKS: Task[] = [
    {
        id: '1',
        projectId: 'p1',
        title: 'Reply to client email',
        description: 'Need to get back to Sarah regarding the Q3 targets.',
        completed: false,
        priority: 1,
        due: {
            date: getTodayDateString(),
            isRecurring: false
        },
        labels: ['work-123'],
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        projectId: 'p1',
        title: 'Buy groceries',
        description: 'Milk, Eggs, Bread, and Coffee.',
        completed: false,
        priority: 4,
        due: {
            date: dateAhead(1), // Tomorrow
            isRecurring: true,
            recurringString: 'every week'
        },
        labels: ['personal-456'],
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        projectId: 'proj-1',
        sectionId: 'sec-1',
        title: 'Finalize UI design system',
        description: 'Check contrast ratios and spacing scale.',
        completed: false,
        priority: 2,
        labels: ['design-789', 'work-123'],
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        projectId: 'proj-1',
        sectionId: 'sec-2',
        title: 'Implement mock data layer',
        description: '',
        completed: true,
        priority: 3,
        labels: ['work-123'],
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '5',
        projectId: 'proj-2',
        title: 'Review quarterly report',
        description: 'Focus on marketing spend vs acquisition.',
        completed: false,
        priority: 2,
        due: {
            date: dateAhead(3),
            isRecurring: false
        },
        labels: ['urgent-101'],
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '6',
        projectId: 'proj-2',
        title: 'Draft launch announcement',
        description: 'Keep it punchy.',
        completed: false,
        priority: 3,
        due: {
            date: dateAhead(6),
            isRecurring: false
        },
        labels: [],
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '7',
        projectId: 'p1',
        title: 'Pick up dry cleaning',
        description: '',
        completed: false,
        priority: 4,
        due: {
            date: dateAhead(-2), // Overdue
            isRecurring: false
        },
        labels: [],
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 't8', // This task was not explicitly changed in the snippet, keeping original structure
        projectId: 'p2',
        title: 'Final sanity check',
        description: '',
        completed: false,
        priority: 1,
        due: {
            date: '2026-03-08', // In 6 days
            isRecurring: false,
        },
        labels: [],
        order: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
