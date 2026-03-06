import React from 'react';
import { Task } from '../../types';
import { cn } from '../../lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';
import { TaskActions } from './TaskActions';
import { TaskMeta } from './TaskMeta';
import { DragHandle } from './DragHandle';
import { useTaskStore, useUIStore } from '../../app/store';

export interface TaskItemProps {
    task: Task;
    isNested?: boolean;
    isSubtask?: boolean;
    isOverlay?: boolean;
    isPlaceholder?: boolean;
    dragHandle?: React.ReactNode;
}

const priorityColors: Record<number, string> = {
    1: 'text-red-500',
    2: 'text-orange-500',
    3: 'text-blue-500',
    4: 'text-muted-foreground/40',
};

export const TaskItem: React.FC<TaskItemProps> = ({
    task,
    isNested = false,
    isSubtask = false,
    isOverlay = false,
    isPlaceholder = false,
    dragHandle
}) => {
    const openTaskDrawer = useUIStore((state) => state.openTaskDrawer);
    const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);

    return (
        <div
            data-testid={`task-item-${task.id}`}
            onClick={isPlaceholder ? undefined : () => openTaskDrawer(task.id)}
            className={cn(
                "group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 border relative",
                // Base styles
                !isPlaceholder && !isOverlay && (isNested ? "hover:bg-muted/50 border-transparent hover:border-border/30" : "bg-card hover:shadow-soft border-border/40 hover:border-primary/20"),
                !isPlaceholder && !isOverlay && "cursor-pointer",
                // Completion state
                task.completed && !isOverlay && "opacity-60 bg-muted/20",
                // Subtask styling
                isSubtask && "ml-8 py-1 px-1 border-transparent bg-transparent hover:bg-muted/30",
                // Overlay styles (Floating)
                isOverlay && "shadow-2xl ring-1 ring-primary/20 bg-background scale-[1.03] rotate-1 cursor-grabbing z-50 border-primary/30",
                // Placeholder styles
                isPlaceholder && "border-2 border-dashed border-border/60 bg-muted/5 min-h-[72px] cursor-default"
            )}
        >
            <div data-testid="task-item-content" className={cn("flex w-full items-start gap-3 py-0.5", isPlaceholder && "invisible")}>
                {/* Fixed-width handle container to keep content aligned */}
                <div className="w-8 h-8 flex items-center justify-center shrink-0 mt-[1px]" data-testid="task-handle-container">
                    {dragHandle || (isSubtask && (
                        <DragHandle
                            isInactive={true}
                            className="opacity-0 group-hover:opacity-40"
                        />
                    ))}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompletion(task.id);
                    }}
                    className={cn(
                        "mt-[9px] shrink-0 focus:outline-none transition-transform active:scale-90",
                        isSubtask && "mt-[7px]"
                    )}
                    aria-label={task.completed ? "Mark as uncompleted" : "Mark as completed"}
                >
                    {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
                    ) : (
                        <Circle className={cn("w-5 h-5 transition-colors", priorityColors[task.priority])} aria-hidden="true" />
                    )}
                </button>

                <div className="flex-1 min-w-0 pt-1.5 pb-1 pr-1">
                    <div className="flex items-center justify-between gap-2">
                        <h4
                            data-testid="task-title"
                            className={cn(
                                "text-sm font-medium leading-tight truncate",
                                isSubtask && "text-xs",
                                task.completed && "text-muted-foreground line-through opacity-60"
                            )}
                        >
                            {task.title}
                        </h4>
                        <TaskActions className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {task.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {task.description}
                        </p>
                    )}

                    <TaskMeta
                        priority={task.priority}
                        labels={task.labels}
                        due={task.due}
                        className={cn(
                            "mt-2.5 opacity-80 group-hover:opacity-100 transition-opacity",
                            isSubtask && "mt-1.5 scale-95 origin-left"
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
