import React from 'react';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TaskEmptyStateProps {
    message?: string;
    onAction?: () => void;
    actionLabel?: string;
    className?: string;
}

export const TaskEmptyState: React.FC<TaskEmptyStateProps> = ({
    message = "No tasks found.",
    onAction,
    actionLabel = "Create Task",
    className
}) => {
    return (
        <div className={cn("flex flex-col items-center justify-center p-12 text-center bg-muted/20 rounded-3xl border border-dashed border-border/60 animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
            <p className="text-sm font-medium text-muted-foreground">{message}</p>
            {onAction && (
                <Button onClick={onAction} className="mt-5 gap-2 shadow-soft hover:shadow-md transition-shadow">
                    <Plus className="w-4 h-4" />
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};
