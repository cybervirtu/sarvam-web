import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';
import { TaskItem } from './TaskItem';
import { DragHandle } from './DragHandle';

interface TaskRowSortableProps {
    task: Task;
    isNested?: boolean;
}

export const TaskRowSortable: React.FC<TaskRowSortableProps> = ({ task, isNested }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative">
            <TaskItem
                task={task}
                isNested={isNested}
                isPlaceholder={isDragging}
                dragHandle={
                    <DragHandle
                        attributes={attributes}
                        listeners={listeners}
                        className="absolute -left-10 top-1/2 -translate-y-1/2"
                    />
                }
            />
        </div>
    );
};
