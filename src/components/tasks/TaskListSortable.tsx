import React, { useMemo, useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../../types';
import { useTaskStore } from '../../app/store';
import { TaskRowSortable } from './TaskRowSortable';
import { TaskItem } from './TaskItem';
import { createPortal } from 'react-dom';

interface TaskListSortableProps {
    projectId: string | null;
    sectionId: string | null;
    tasks: Task[];
    isNested?: boolean;
}

const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

export const TaskListSortable: React.FC<TaskListSortableProps> = ({ projectId, sectionId, tasks, isNested }) => {
    const { reorderTasksWithinSection } = useTaskStore();
    const [activeId, setActiveId] = useState<string | null>(null);

    // Ensure we have a stable, sorted list of IDs for SortableContext
    const orderedTaskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

    const activeTask = useMemo(
        () => tasks.find((t) => t.id === activeId),
        [activeId, tasks]
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = orderedTaskIds.indexOf(active.id as string);
            const newIndex = orderedTaskIds.indexOf(over.id as string);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newOrderedTaskIds = arrayMove(orderedTaskIds, oldIndex, newIndex);
                reorderTasksWithinSection(projectId, sectionId, newOrderedTaskIds);
            }
        }

        setActiveId(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    if (tasks.length === 0) return null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
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

            {createPortal(
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeTask ? (
                        <TaskItem
                            key={`overlay-${activeTask.id}`}
                            task={activeTask}
                            isNested={isNested}
                            isOverlay={true}
                        />
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
};
