import React, { useState } from 'react';
import { Task, Priority } from '../../types';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { Plus, Loader2 } from 'lucide-react';
import { useTaskStore } from '../../app/store';
import { TaskEmptyState } from './TaskEmptyState';

interface TaskListProps {
    tasks: Task[];
    isLoading?: boolean;
    emptyMessage?: string;
    hideAddButton?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    isLoading,
    emptyMessage = "No tasks found.",
    hideAddButton = false,
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const addTask = useTaskStore((state) => state.addTask);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-sm font-medium">Loading tasks...</span>
            </div>
        );
    }

    const handleSave = (taskData: { title: string; priority: Priority; labels?: string[] }) => {
        addTask(taskData);
        setIsAdding(false);
    };

    if (tasks.length === 0 && !isAdding) {
        return (
            <TaskEmptyState
                message={emptyMessage}
                onAction={hideAddButton ? undefined : () => setIsAdding(true)}
            />
        );
    }

    return (
        <div className="space-y-1" data-testid="task-list">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}

            {!hideAddButton && (
                isAdding ? (
                    <div className="mt-3">
                        <TaskForm
                            onSave={handleSave}
                            onCancel={() => setIsAdding(false)}
                        />
                    </div>
                ) : (
                    <button
                        data-testid="quick-add-btn"
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 mt-2 group"
                    >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-muted-foreground/60 group-hover:text-primary transition-colors">
                            Add task
                        </span>
                    </button>
                )
            )}
        </div>
    );
};
