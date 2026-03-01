import React from 'react';
import { Task } from '../../types';
import { cn } from '../../lib/utils';
import { CheckCircle2, Circle, Hash } from 'lucide-react';
import { TaskActions } from './TaskActions';

import { useTaskStore, useUIStore } from '../../app/store';

interface TaskItemProps {
    task: Task;
}

const priorityColors: Record<number, string> = {
    1: 'text-red-500',
    2: 'text-orange-500',
    3: 'text-blue-500',
    4: 'text-muted-foreground/40',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const openTaskDrawer = useUIStore((state) => state.openTaskDrawer);
    const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);

    return (
        <div
            onClick={() => openTaskDrawer(task.id)}
            className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50 cursor-pointer"
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskCompletion(task.id);
                }}
                className="mt-0.5 shrink-0 focus:outline-none transition-transform active:scale-90"
            >
                {task.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                    <Circle className={cn("w-5 h-5 transition-colors", priorityColors[task.priority])} />
                )}
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <h4 className={cn(
                        "text-sm font-medium leading-tight truncate",
                        task.isCompleted && "text-muted-foreground line-through opacity-60"
                    )}>
                        {task.content}
                    </h4>
                    <TaskActions className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {task.description}
                    </p>
                )}

                <div className="flex items-center gap-3 mt-2.5">
                    {task.labels.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            {task.labels.map(labelId => (
                                <div key={labelId} className="flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-medium">
                                    <Hash className="w-2.5 h-2.5" />
                                    {labelId === 'l1' ? 'Work' : labelId === 'l2' ? 'Personal' : 'Urgent'}
                                </div>
                            ))}
                        </div>
                    )}

                    {task.dueDate && (
                        <span className="text-[10px] font-medium text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded">
                            {task.dueDate.date}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
