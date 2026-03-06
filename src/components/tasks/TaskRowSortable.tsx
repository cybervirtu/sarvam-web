import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';
import { TaskItem } from './TaskItem';
import { DragHandle } from './DragHandle';
import { useTaskStore } from '../../app/store';
import { TaskListSortable } from './TaskListSortable';
import { cn } from '../../utils/cn';

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

    const { setNodeRef: setParentRef, isOver } = useDroppable({
        id: `parent:${task.id}`,
        disabled: isDragging, // Can't drop onto itself
    });

    const subtasks = useTaskStore(state => state.getSubtasks(task.id));

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative">
            <div
                ref={setParentRef}
                className={cn(
                    "space-y-1 rounded-xl transition-all duration-300",
                    isOver ? "bg-primary/5 ring-1 ring-primary/20" : ""
                )}
            >
                <TaskItem
                    task={task}
                    isNested={isNested}
                    isPlaceholder={isDragging}
                    dragHandle={
                        <DragHandle
                            attributes={attributes}
                            listeners={listeners}
                        />
                    }
                />

                {/* Subtasks - now sortable! */}
                <div className="pl-6 mt-1 overflow-hidden">
                    <TaskListSortable
                        projectId={task.projectId || null}
                        sectionId={task.sectionId || null}
                        tasks={subtasks}
                        isNested={true}
                    />
                </div>

                {isOver && subtasks.length === 0 && (
                    <div className="ml-10 py-3 text-center text-muted-foreground/30 text-[10px] italic border-t border-dashed border-border/20">
                        Drop subtask here
                    </div>
                )}
            </div>
        </div>
    );
};
