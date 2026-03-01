import { MOCK_TASKS, MOCK_PROJECTS, MOCK_LABELS, MOCK_SECTIONS } from './data';
import { Task, Project, Label, Section } from '../../types';

const LATENCY = 300; // Simulated network latency in ms

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTasks = async (): Promise<Task[]> => {
    await sleep(LATENCY);
    return [...MOCK_TASKS];
};

export const getProjects = async (): Promise<Project[]> => {
    await sleep(LATENCY);
    return [...MOCK_PROJECTS];
};

export const getLabels = async (): Promise<Label[]> => {
    await sleep(LATENCY);
    return [...MOCK_LABELS];
};

export const getSections = async (projectId: string): Promise<Section[]> => {
    await sleep(LATENCY);
    return MOCK_SECTIONS.filter(s => s.projectId === projectId);
};

export const getTaskById = async (id: string): Promise<Task | undefined> => {
    await sleep(LATENCY);
    return MOCK_TASKS.find(t => t.id === id);
};

export const getProjectTasks = async (projectId: string): Promise<Task[]> => {
    await sleep(LATENCY);
    return MOCK_TASKS.filter(t => t.projectId === projectId);
};
