import { Priority, DueDate } from '../../types';
import { Hash, Flag, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PRIORITY_BADGE_COLORS, resolveLabelName } from './constants';

const formatDueDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date.getTime())) return dateStr;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';

    // For other dates, use DD-MM-YYYY as requested
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

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
                <div className={cn(
                    "flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md transition-colors cursor-default",
                    (new Date(due.date + 'T00:00:00').getTime() < new Date().setHours(0, 0, 0, 0))
                        ? "text-red-600/90 bg-red-500/10 hover:bg-red-500/20"
                        : "text-primary/80 bg-primary/10 hover:bg-primary/20"
                )}>
                    <Calendar className="w-2.5 h-2.5" />
                    <span>{formatDueDate(due.date)}</span>
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
