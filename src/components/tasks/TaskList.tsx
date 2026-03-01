import React from 'react';
import { Task } from '../../types';
import { TaskItem } from './TaskItem';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '../common/Button';

interface TaskListProps {
    tasks: Task[];
    isLoading?: boolean;
    emptyMessage?: string;
    onAddTask?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    isLoading,
    emptyMessage = "No tasks found.",
    onAddTask
}) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-sm font-medium">Loading tasks...</span>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                {onAddTask && (
                    <Button onClick={onAddTask} className="mt-4 gap-2 shadow-soft">
                        <Plus className="w-4 h-4" />
                        Create Task
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}

            {onAddTask && (
                <button
                    onClick={onAddTask}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 mt-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-muted-foreground/60 group-hover:text-primary transition-colors">
                        Add task
                    </span>
                </button>
            )}
        </div>
    );
};
