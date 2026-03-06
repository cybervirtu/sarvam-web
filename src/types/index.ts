/** 
 * Foundational IDs are strings on the frontend to gracefully support 
 * UUIDs that typically come back from a Postgres + FastAPI backend.
 */

// --- Priority ---
export type Priority = 1 | 2 | 3 | 4;
// e.g., 1 = P1 (Highest), 4 = P4 (Lowest/Default)

// --- DueDate ---
export interface DueDate {
    date: string; // YYYY-MM-DD
    datetime?: string; // ISO 8601 extended format for specific times
    timezone?: string; // Timezone designation, e.g., 'America/Los_Angeles'
    isRecurring: boolean;
    recurrenceRule?: string | null; // e.g., "daily", "weekly", "every 3 days"
}

// --- Reminder ---
export interface Reminder {
    id: string;
    taskId: string;
    triggerTime: string; // ISO 8601 timestamp
    isEmail: boolean;
    isPush: boolean;
    createdAt: string; // ISO 8601 timestamp
    updatedAt: string; // ISO 8601 timestamp
}

// --- Label ---
export interface Label {
    id: string;
    name: string;
    color: string; // Hex code or Tailwind color string
    order: number;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}

// --- Project ---
export interface Project {
    id: string;
    name: string;
    color: string;
    order: number;
    isFavorite: boolean;
    isInbox: boolean;
    isShared: boolean;
    viewStyle: 'list' | 'board';
    createdAt: string;
    updatedAt: string;
}

// --- Section ---
export interface Section {
    id: string;
    projectId: string;
    name: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

// --- Task ---
export interface Task {
    id: string;
    projectId?: string | null;
    sectionId?: string | null;
    parentId?: string | null; // For infinite nesting/sub-tasks

    title: string; // The primary task title
    description?: string | null; // Optional detailed description markdown

    completed: boolean;
    priority: Priority;

    due?: DueDate | null;
    labels: string[]; // Array of Label IDs

    order?: number; // Ordering within the project/section
    durationMinutes?: number | null; // Estimated time
    deadline?: string | null; // Hard deadline (ISO string)

    createdAt: string;
    updatedAt: string;
    completedAt?: string | null;
}
