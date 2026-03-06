import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface GroupHeaderProps {
    label: string;
    icon?: LucideIcon;
    count?: number;
    variant?: 'default' | 'overdue' | 'dimmed';
    rightElement?: React.ReactNode;
    className?: string;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({
    label,
    icon: Icon,
    count,
    variant = 'default',
    rightElement,
    className = '',
}) => {
    const variantClasses = {
        default: 'text-foreground/90 border-border/50',
        overdue: 'text-orange-600/80 dark:text-orange-400/80 border-border/50',
        dimmed: 'text-muted-foreground/50 border-border/50',
    };

    return (
        <header className={`flex items-center justify-between py-2 px-1 border-b mb-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 transition-colors ${variantClasses[variant]} ${className}`}>
            <div className="flex items-center gap-2.5">
                {Icon && <Icon className="w-4 h-4" />}
                <h3 className="text-sm font-bold tracking-tight uppercase">
                    {label}
                </h3>
                {count !== undefined && count > 0 && (
                    <div className="flex items-center gap-1.5 ml-1">
                        <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
                        <span className="text-[10px] font-semibold text-muted-foreground/40 tabular-nums">
                            {count} {count === 1 ? 'task' : 'tasks'}
                        </span>
                    </div>
                )}
            </div>
            {rightElement && (
                <div className="flex items-center">
                    {rightElement}
                </div>
            )}
        </header>
    );
};
