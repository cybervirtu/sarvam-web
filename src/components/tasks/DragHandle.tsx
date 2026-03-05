import React from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DraggableAttributes } from '@dnd-kit/core';
import { DraggableSyntheticListeners } from '@dnd-kit/core';

interface DragHandleProps {
    attributes: DraggableAttributes;
    listeners: DraggableSyntheticListeners;
    className?: string;
}

export const DragHandle: React.FC<DragHandleProps> = ({ attributes, listeners, className }) => {
    return (
        <button
            {...attributes}
            {...listeners}
            className={cn(
                "p-1.5 text-muted-foreground/30 hover:text-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center rounded-md hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary/20",
                className
            )}
            title="Drag to reorder"
            type="button"
            onClick={(e) => e.stopPropagation()}
        >
            <GripVertical className="w-4 h-4 transition-transform group-active:scale-95" />
        </button>
    );
};
