import { useMemo } from 'react';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../../types';
import { TaskRowSortable } from './TaskRowSortable';

interface TaskListSortableProps {
    projectId: string | null;
    sectionId: string | null;
    tasks: Task[];
    isNested?: boolean;
}

export const TaskListSortable: React.FC<TaskListSortableProps> = ({ tasks, isNested }) => {
    // Ensure we have a stable, sorted list of IDs for SortableContext
    const orderedTaskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

    if (tasks.length === 0) return null;

    return (
        <SortableContext
            items={orderedTaskIds}
            strategy={verticalListSortingStrategy}
        >
            <div className="space-y-1">
                {tasks.map((task) => (
                    <TaskRowSortable
                        key={task.id}
                        task={task}
                        isNested={isNested}
                    />
                ))}
            </div>
        </SortableContext>
    );
};
