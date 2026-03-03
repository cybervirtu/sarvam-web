import { Priority, DueDate } from '../../types';
import { Hash, Flag, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PRIORITY_BADGE_COLORS, resolveLabelName } from './constants';

interface TaskMetaProps {
    priority: Priority;
    labels: string[];
    due?: DueDate | null;
    className?: string;
}

export const TaskMeta: React.FC<TaskMetaProps> = ({ priority, labels, due, className }) => {
    // Determine if we need to show anything to avoid returning an empty container
    if (labels.length === 0 && !due && priority === 4) return null;

    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)}>
            {labels.length > 0 && (
                <div className="flex items-center gap-1.5 focus-within:ring-2 focus-within:ring-primary rounded">
                    {labels.map(labelId => (
                        <span key={labelId} className="flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded-md text-muted-foreground font-medium transition-colors hover:bg-muted/80">
                            <Hash className="w-2.5 h-2.5 opacity-70" />
                            {resolveLabelName(labelId)}
                        </span>
                    ))}
                </div>
            )}

            {due && (
                <div className="flex items-center gap-1 text-[10px] font-medium text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded-md transition-colors hover:bg-primary/20 cursor-default">
                    <Calendar className="w-2.5 h-2.5" />
                    <span>{due.date}</span>
                </div>
            )}

            {/* Show explicit priority indicators for P1-P3 */}
            {priority < 4 && (
                <div className={cn("flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-medium transition-colors cursor-default", PRIORITY_BADGE_COLORS[priority])}>
                    <Flag className="w-2.5 h-2.5" />
                    P{priority}
                </div>
            )}
        </div>
    );
};
