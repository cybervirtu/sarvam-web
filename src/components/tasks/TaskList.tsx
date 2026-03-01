import React, { useState } from 'react';
import { Task, Priority } from '../../types';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { useTaskStore } from '../../app/store';

interface TaskListProps {
    tasks: Task[];
    isLoading?: boolean;
    emptyMessage?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    isLoading,
    emptyMessage = "No tasks found.",
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

    const handleSave = (taskData: { content: string; priority: Priority }) => {
        addTask(taskData);
        setIsAdding(false);
    };

    if (tasks.length === 0 && !isAdding) {
        return (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                <Button onClick={() => setIsAdding(true)} className="mt-4 gap-2 shadow-soft">
                    <Plus className="w-4 h-4" />
                    Create Task
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}

            {isAdding ? (
                <div className="mt-3">
                    <TaskForm
                        onSave={handleSave}
                        onCancel={() => setIsAdding(false)}
                    />
                </div>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
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
