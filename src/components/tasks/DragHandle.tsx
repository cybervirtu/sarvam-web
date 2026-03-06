import React from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DraggableAttributes } from '@dnd-kit/core';
import { DraggableSyntheticListeners } from '@dnd-kit/core';

interface DragHandleProps {
    attributes?: DraggableAttributes;
    listeners?: DraggableSyntheticListeners;
    className?: string;
    isInactive?: boolean;
}

export const DragHandle: React.FC<DragHandleProps> = ({ attributes, listeners, className, isInactive }) => {
    return (
        <button
            {...(attributes || {})}
            {...(listeners || {})}
            className={cn(
                "p-1 flex items-center justify-center rounded-md focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200",
                !isInactive
                    ? "text-muted-foreground/30 hover:text-foreground hover:bg-muted/60 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100"
                    : "text-muted-foreground/20 cursor-not-allowed opacity-0 group-hover:opacity-40",
                className
            )}
            title={isInactive ? "Reordering subtasks is not supported yet" : "Drag to reorder"}
            type="button"
            onClick={(e) => e.stopPropagation()}
        >
            <GripVertical className={cn("w-4 h-4", !isInactive && "transition-transform group-active:scale-95")} />
        </button>
    );
};
