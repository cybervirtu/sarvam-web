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
    recurringString?: string; // e.g., "every weekday" or RRULE format
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
    projectId: string;
    sectionId?: string | null;

    content: string; // The primary task title/description
    description: string; // Optional detailed description markdown

    isCompleted: boolean;
    priority: Priority;

    dueDate?: DueDate | null;
    labels: string[]; // Array of Label IDs

    order: number; // Ordering within the project/section
    parentId?: string | null; // For infinite nesting/sub-tasks

    createdAt: string;
    updatedAt: string;
}
