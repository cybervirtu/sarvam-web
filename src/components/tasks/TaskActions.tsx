import React from 'react';
import { MoreVertical } from 'lucide-react';
import { IconButton } from '../common/IconButton';

interface TaskActionsProps {
    className?: string;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
    className
}) => {
    return (
        <div className={className}>
            <IconButton
                icon={MoreVertical}
                className="h-8 w-8 text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-all duration-200"
                title="More actions"
            />
        </div>
    );
};
