import React from 'react';
import { Section, Task } from '../../types';
import { TaskListSortable } from '../tasks/TaskListSortable';
import { ChevronDown, ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import { IconButton } from '../common/IconButton';
import { TaskForm } from '../tasks/TaskForm';
import { useTaskStore, useProjectStore } from '../../app/store';
import { Priority } from '../../types';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../utils/cn';

interface SectionListProps {
    section: Section;
    tasks: Task[];
}

export const SectionList: React.FC<SectionListProps> = ({ section, tasks }) => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const [isAdding, setIsAdding] = React.useState(false);
    const [isEditingName, setIsEditingName] = React.useState(false);
    const [editName, setEditName] = React.useState(section.name);
    const { addTask, clearTasksSection } = useTaskStore();
    const { updateSection, deleteSection } = useProjectStore();

    const { setNodeRef, isOver } = useDroppable({
        id: `section:${section.id}`,
    });

    const handleSaveTask = (taskData: {
        title: string;
        description?: string;
        priority: Priority;
        due?: { date: string; isRecurring: boolean } | null;
        labels?: string[];
    }) => {
        addTask({
            ...taskData,
            projectId: section.projectId,
            sectionId: section.id,
        });
        setIsAdding(false);
    };

    const handleRenameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editName.trim() && editName !== section.name) {
            updateSection(section.id, { name: editName.trim() });
        }
        setIsEditingName(false);
    };

    const memoizedTasks = React.useMemo(() => tasks, [tasks]);

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "space-y-2 rounded-2xl transition-all duration-300",
                isOver ? "bg-primary/5 ring-1 ring-primary/20" : ""
            )}
        >
            <header className="flex items-center justify-between group py-3 px-2 rounded-xl transition-colors hover:bg-muted/30">
                <div
                    className="flex items-center gap-2 cursor-pointer select-none flex-1"
                    onClick={() => {
                        if (!isEditingName) setIsExpanded(!isExpanded);
                    }}
                >
                    <div className="text-muted-foreground/40 group-hover:text-foreground transition-colors mr-1">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                    {isEditingName ? (
                        <form onSubmit={handleRenameSubmit} className="flex-1" onClick={e => e.stopPropagation()}>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                autoFocus
                                onBlur={() => setIsEditingName(false)}
                                className="bg-transparent border-b border-primary focus:outline-none focus:ring-0 text-sm font-bold tracking-tight text-foreground/80 lowercase first-letter:uppercase placeholder-muted-foreground w-full"
                            />
                        </form>
                    ) : (
                        <h3 className="text-sm font-bold tracking-tight text-foreground/80 lowercase first-letter:uppercase transition-colors group-hover:text-foreground">
                            {section.name}
                        </h3>
                    )}
                    <span className="text-[10px] font-semibold text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full ring-1 ring-border/50 group-hover:bg-background transition-colors">
                        {tasks.length}
                    </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconButton
                        icon={MoreHorizontal}
                        size="sm"
                        title="Rename section"
                        className="text-muted-foreground hover:bg-background/80 hover:text-foreground"
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditName(section.name);
                            setIsEditingName(true);
                        }}
                    />
                    <IconButton
                        icon={Plus}
                        size="sm"
                        title="Add task to section"
                        className="text-muted-foreground hover:bg-background/80 hover:text-foreground"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(true);
                            setIsAdding(true);
                        }}
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete section "${section.name}"? Tasks will become unsectioned.`)) {
                                clearTasksSection(section.id);
                                deleteSection(section.id);
                            }
                        }}
                        title="Delete section"
                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors flex shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                    </button>
                </div>
            </header>

            {isExpanded && (
                <div className="space-y-1 pl-1 border-l border-border/20 ml-2 animate-in slide-in-from-top-1 duration-200 min-h-[1.5rem]">
                    {isAdding && (
                        <div className="mb-3 mt-1 pr-1">
                            <TaskForm
                                onSave={handleSaveTask}
                                onCancel={() => setIsAdding(false)}
                            />
                        </div>
                    )}

                    <TaskListSortable projectId={section.projectId} sectionId={section.id} tasks={memoizedTasks} isNested={true} />

                    {tasks.length === 0 && !isAdding && (
                        <div className="py-6 text-center text-muted-foreground/40 text-xs italic bg-muted/20 rounded-xl border border-dashed border-border/40 mt-2">
                            No tasks in this section
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
