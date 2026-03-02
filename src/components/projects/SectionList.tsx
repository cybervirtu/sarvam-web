import React from 'react';
import { Section, Task } from '../../types';
import { TaskItem } from '../tasks/TaskItem';
import { ChevronDown, ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import { IconButton } from '../common/IconButton';

interface SectionListProps {
    section: Section;
    tasks: Task[];
}

export const SectionList: React.FC<SectionListProps> = ({ section, tasks }) => {
    const [isExpanded, setIsExpanded] = React.useState(true);

    return (
        <div className="space-y-2">
            <header className="flex items-center justify-between group py-2">
                <div
                    className="flex items-center gap-2 cursor-pointer select-none"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="text-muted-foreground/50 group-hover:text-foreground transition-colors">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                    <h3 className="text-sm font-bold tracking-tight text-foreground/80 lowercase first-letter:uppercase">
                        {section.name}
                    </h3>
                    <span className="text-[10px] font-medium text-muted-foreground/40 bg-muted px-1.5 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconButton icon={MoreHorizontal} size="sm" title="Section Actions" />
                    <IconButton icon={Plus} size="sm" title="Add task to section" />
                </div>
            </header>

            {isExpanded && (
                <div className="space-y-1 pl-1 border-l border-border/20 ml-2 animate-in slide-in-from-top-1 duration-200">
                    {tasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))}

                    {tasks.length === 0 && (
                        <div className="py-8 text-center text-muted-foreground/30 text-xs italic">
                            No tasks in this section
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
